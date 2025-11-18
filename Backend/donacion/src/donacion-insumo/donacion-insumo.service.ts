
import { Injectable, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DonacionInsumo } from './donacion-insumo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoDonacionInsumo } from '../estado-donacion-insumo/estado-donacion-insumo.entity'; 
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CrearDonacionInsumoDto } from '../dto/crear-donacion-insumo.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { ActualizarEstadoInsumoDto } from 'src/dto/actualizar-estado-insumo.dto';

interface DonacionInsumoRecibidaDto {
  email: string;
  nombreDonante: string;
  descripcionInsumo: string;
}
interface NuevaDonacionInsumoDto {
  emailAdmin: string;
  nombreDonante: string;
  emailDonante: string;
  telefonoDonante: string;
  descripcionInsumo: string;
  tipoEntrega: string;
  direccionRetiro?: string;
}

@Injectable()
export class DonacionInsumoService {
    private readonly logger = new Logger(DonacionInsumoService.name);
    private readonly correoServiceUrl: string;
    private readonly usuariosServiceUrl: string;
    private readonly inventarioServiceUrl: string;

 constructor(
    @InjectRepository(DonacionInsumo)
    private readonly donacionInsumoRepo: Repository<DonacionInsumo>,
    @InjectRepository(EstadoDonacionInsumo) 
    private readonly EstadoDonacionInsumoRepo: Repository<EstadoDonacionInsumo>, 
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
 ) {
      const correoUrl = this.configService.get<string>('CORREO_SERVICE_URL');
      const usuariosUrl = this.configService.get<string>('USUARIOS_SERVICE_URL');
      const inventarioUrl = this.configService.get<string>('INVENTARIO_SERVICE_URL');
      if (!correoUrl || !usuariosUrl || !inventarioUrl) {
        throw new InternalServerErrorException('Faltan URLs de microservicios en .env');
      }
      this.correoServiceUrl = correoUrl;
      this.usuariosServiceUrl = usuariosUrl;
      this.inventarioServiceUrl = inventarioUrl;
    }

 async crearDonacionInsumo(dto: CrearDonacionInsumoDto): Promise<DonacionInsumo> {
    
    const estadoInicial = await this.EstadoDonacionInsumoRepo.findOne({ where: { nombre: 'Pendiente' } }); 
    if (!estadoInicial) {
     throw new InternalServerErrorException('El estado "Pendiente" no está configurado en la BD');
    }

    const nuevaDonacion = this.donacionInsumoRepo.create(dto);
    nuevaDonacion.estadoInsumo = estadoInicial; 
    
    const donacionGuardada = await this.donacionInsumoRepo.save(nuevaDonacion);

    this.enviarCorreosDeInsumo(donacionGuardada);
    
    return donacionGuardada;
 }

  async findAll(): Promise<DonacionInsumo[]> {
    return this.donacionInsumoRepo.find({
      relations: ['estadoInsumo'], 
      order: { fecha: 'DESC' },
    });
  }

  async findOneById(id: number): Promise<DonacionInsumo> {
    const donacion = await this.donacionInsumoRepo.findOne({ 
      where: { id },
      relations: ['estadoInsumo'] 
    });

    if (!donacion) {
      throw new NotFoundException(`Donación de insumo con ID ${id} no encontrada.`);
    }
    return donacion;
  }

  async findByUserId(userId: number): Promise<DonacionInsumo[]> {
    return this.donacionInsumoRepo.find({
      where: { userId: userId },
      relations: ['estadoInsumo'], 
      order: { fecha: 'DESC' },
    });
  }

  async actualizarEstado(id: number, dto: ActualizarEstadoInsumoDto): Promise<DonacionInsumo> {
    const donacion = await this.donacionInsumoRepo.findOne({ 
      where: { id },
      relations: ['estadoInsumo'] 
    });
    if (!donacion) {
      throw new NotFoundException(`Donación de insumo con ID ${id} no encontrada.`);
    }

    const nuevoEstado = await this.EstadoDonacionInsumoRepo.findOne({ where: { nombre: dto.nuevoEstado } }); 
    if (!nuevoEstado) {
      throw new BadRequestException(`El estado "${dto.nuevoEstado}" no es válido.`);
    }

    donacion.estadoInsumo = nuevoEstado; 
    const donacionActualizada = await this.donacionInsumoRepo.save(donacion);

    if (nuevoEstado.nombre === 'Recibida') {
      this.logger.log(`Donación ${id} marcada como 'Recibida'. Avisando a inventario-api...`);
      
      const dtoParaInventario = {
        donacionOriginalId: donacion.id,
        categoria: donacion.categoria,
        nombre: donacion.nombre,
        descripcion: donacion.descripcion,
        cantidad: donacion.cantidad,
        unidad: donacion.unidad,
        atributos: donacion.atributos,
      };

      try {
        await firstValueFrom(
          this.httpService.post(`${this.inventarioServiceUrl}/inventario/registrar-ingreso-donacion`, dtoParaInventario)
            .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
        );
        this.logger.log(`Ingreso de donación ${id} registrado en inventario-api.`);
        
      } catch (error) {
        this.logger.error(`FALLO al registrar donación ${id} en inventario-api: ${error.message}`);
      }
    }

    return donacionActualizada;
  }

 private async enviarCorreosDeInsumo(donacion: DonacionInsumo): Promise<void> {
    let emailDonante: string | null;
    let nombreDonante: string | null;
    let telefonoDonante: string | null;

    if (donacion.userId) { 
      const usuario = await this.buscarDatosUsuario(donacion.userId);
      if (usuario) {
        emailDonante = usuario.email;
        nombreDonante = `${usuario.nombre} ${usuario.apellido}`;
        telefonoDonante = usuario.telefono;
      } else {
        this.logger.warn(`No se pudieron encontrar datos para el usuario registrado ID ${donacion.userId}`);
        emailDonante = 'usuario.no.encontrado@error.com';
        nombreDonante = 'Usuario Registrado (Error)';
        telefonoDonante = 'N/A';
      }
    } else {
      emailDonante = donacion.emailInvitado;
      nombreDonante = donacion.nombreInvitado;
      telefonoDonante = donacion.telefonoInvitado;
    }

    const emailsAdmins = ['lubertello123@gmail.com']; // (Email de prueba)

    if (emailDonante) { 
     try {
        const dtoDonante: DonacionInsumoRecibidaDto = {
      email: emailDonante,
          nombreDonante: nombreDonante || 'Donante',
          descripcionInsumo: donacion.descripcion || donacion.nombre || 'Donación de insumos'
        };
        await firstValueFrom(this.httpService.post(`${this.correoServiceUrl}/donacion-insumo-recibida`, dtoDonante));
        this.logger.log(`Email de 'Insumo Recibido' enviado a ${emailDonante}`);
     } catch (error) {
        this.logger.error(`FALLO al enviar email de 'Insumo Recibido' a ${emailDonante}: ${error.message}`);
     }
    } else {
      this.logger.warn(`Donación ${donacion.id} sin email de donante, no se puede notificar.`);
    }       
    try {
      for (const emailAdmin of emailsAdmins) {

        const dtoAdmin: NuevaDonacionInsumoDto = {
          emailAdmin: emailAdmin,
          nombreDonante: nombreDonante || 'Donante Anonimo',
          emailDonante: emailDonante || 'email.faltante@huellitas.com',
          telefonoDonante: telefonoDonante || 'N/A',
          descripcionInsumo: donacion.descripcion || donacion.nombre || 'Donación de insumos',
          tipoEntrega: donacion.tipoEntrega,
          direccionRetiro: donacion.direccionRetiro || 'N/A' 
        };

        await firstValueFrom(this.httpService.post(`${this.correoServiceUrl}/nueva-donacion-insumo`, dtoAdmin));
      }
      this.logger.log(`Emails de 'Nueva Donación Insumo' enviados a ${emailsAdmins.length} admin(s).`);
    } catch (error) {
      this.logger.error(`FALLO al enviar email de 'Nueva Donación Insumo' a admins: ${error.message}`);
    }
    }

 private async buscarDatosUsuario(userId: number): Promise<any | null> {
    try {
      const url = `${this.usuariosServiceUrl}/usuarios/${userId}`;
      const respuesta = await firstValueFrom(
        this.httpService.get(url)
          .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
      );
      return respuesta.data;
    } catch (error) {
      this.logger.error(`Error al buscar datos de usuario ID ${userId} en usuarios-api: ${error.message}`);
      return null;
    }
 }

 async marcarComoRegistrado(id: number): Promise<DonacionInsumo> {
    const donacion = await this.donacionInsumoRepo.findOne({ 
      where: { id },
      relations: ['estadoInsumo'] 
  });
    if (!donacion) {
      throw new NotFoundException(`Donación de insumo con ID ${id} no encontrada.`);
    }

    if (donacion.estadoInsumo.nombre !== 'Recibida') {
      throw new BadRequestException(
        `La donación ${id} no puede registrarse. Solo se registran donaciones "Recibidas".`
      );
    }

    const nuevoEstado = await this.EstadoDonacionInsumoRepo.findOne({ where: { nombre: 'Registrada en Stock' } }); // <-- ¡Tu repo!
    if (!nuevoEstado) {
      throw new InternalServerErrorException('El estado "Registrada en Stock" no está en la BD.');
    }
    
    donacion.estadoInsumo = nuevoEstado;
    return this.donacionInsumoRepo.save(donacion);
  }
}