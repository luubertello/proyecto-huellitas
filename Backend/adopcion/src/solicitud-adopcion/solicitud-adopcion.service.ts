// En: src/solicitud-adopcion/solicitud-adopcion.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SolicitudAdopcion } from './solicitud-adopcion.entity';
import { FormularioAdopcion } from '../formulario-adopcion/formulario-adopcion.entity';
import { Estado } from '../estado/estado.entity';
import { CambioEstado } from '../cambio-estado/cambio-estado.entity';
import { CrearSolicitudDto } from '../DTO/crear-solicitud.DTO';
import { CambiarEstadoDto } from '../DTO/cambiar-estado.DTO';
import { ConfigService } from '@nestjs/config';

interface NotificacionSolicitudDto {
  email: string;
  nombreAdoptante: string;
  nombreAnimal: string;
}

interface AdminNotificacionDto {
      emailAdmin: string;
      emailAdoptante: string;
      nombreAdoptante: string;
      nombreAnimal: string;
    }

@Injectable()
export class SolicitudAdopcionService {
  private readonly USUARIOS_SERVICE_URL = 'http://usuarios-api:3000/usuarios';
  private readonly ANIMALES_SERVICE_URL = 'http://animales-api:3000/animales';
  private readonly CORREO_SERVICE_URL = 'http://correo-api:3000/email';

  private readonly logger = new Logger(SolicitudAdopcionService.name);

  constructor(
    @InjectRepository(SolicitudAdopcion) private solicitudRepo: Repository<SolicitudAdopcion>,
    @InjectRepository(FormularioAdopcion) private formularioRepo: Repository<FormularioAdopcion>,
    @InjectRepository(Estado) private estadoRepo: Repository<Estado>,
    @InjectRepository(CambioEstado) private cambioEstadoRepo: Repository<CambioEstado>,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CrearSolicitudDto, adoptanteId: number): Promise<SolicitudAdopcion> {
    const { animalId, ...formData } = dto;
    let adoptanteData: any;
    let animalData: any;

    try {
      adoptanteData = (await firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${adoptanteId}`))).data;
      animalData = (await firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${animalId}`))).data;

    } catch (error) {
      console.error('--- ERROR ORIGINAL DE LA PETICIÓN HTTP ---');
      console.error(error.response?.data || error.message); 
      throw new NotFoundException('El usuario o el animal especificado no existe.');
    }

    const estadoInicial = await this.estadoRepo.findOne({ where: { nombre: 'Pendiente' } });
    if (!estadoInicial) {
      throw new InternalServerErrorException('El estado inicial "Pendiente" no está configurado en la base de datos.');
    }
    const nuevoFormulario = this.formularioRepo.create(formData);
    const formularioGuardado = await this.formularioRepo.save(nuevoFormulario);
    const nuevaSolicitud = this.solicitudRepo.create({
      adoptanteId: adoptanteId,
      animalId: animalId,
      formulario: formularioGuardado,
      estadoActual: estadoInicial,
    });
    const solicitudGuardada = await this.solicitudRepo.save(nuevaSolicitud);

    try {
      this.logger.log(`Enviando emails de creación para solicitud ${solicitudGuardada.id}`);

      const emailDto: NotificacionSolicitudDto = {
        email: adoptanteData.email,
        nombreAdoptante: adoptanteData.nombre,
        nombreAnimal: animalData.nombre
      };

      await firstValueFrom(
        this.httpService.post(`${this.CORREO_SERVICE_URL}/solicitud-recibida`, emailDto)
          .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
      );

      const emailsAdmins = ['lubertello123@gmail.com']; 

      for (const emailAdmin of emailsAdmins) {
        
        const dtoAdmin: AdminNotificacionDto = {
          emailAdmin: emailAdmin,            
          emailAdoptante: adoptanteData.email, 
          nombreAdoptante: adoptanteData.nombre,
          nombreAnimal: animalData.nombre
        };

        await firstValueFrom(
          this.httpService.post(`${this.CORREO_SERVICE_URL}/nueva-solicitud`, dtoAdmin)
            .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
        );
      }
      this.logger.log(`Emails de "Nueva Solicitud" enviados a ${emailsAdmins.length} admin(s).`);

    } catch (error) {
      this.logger.error(`FALLO al enviar emails de creación para solicitud ${solicitudGuardada.id}: ${error.message}`);
    }
    return solicitudGuardada;
}

// Busca todas las solicitudes
  async findAll(): Promise<any[]> { 
    const solicitudes = await this.solicitudRepo.find({
      relations: ['estadoActual'], 
      order: { fechaSolicitud: 'DESC' },
    });

    const solicitudesEnriquecidas = await Promise.all(
      solicitudes.map(async (solicitud) => {
      
        let adoptanteData = { nombre: 'Adoptante no encontrado' };
        let animalData = { nombre: 'Animal no encontrado' };

        try {
          const animalRes = await firstValueFrom(
      this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${solicitud.animalId}`)
          );
          animalData = animalRes.data;
        } catch (e) {
          console.error(`[findAll] Error al buscar animal ${solicitud.animalId}:`, e.message);
        }

        try {
          const adoptanteRes = await firstValueFrom(
      this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${solicitud.adoptanteId}`)
          );
          adoptanteData = adoptanteRes.data;
        } catch (e) {
          console.error(`[findAll] Error al buscar adoptante ${solicitud.adoptanteId}:`, e.message);
        }

        return {
          ...solicitud,
          animal: animalData, 
          adoptante: adoptanteData 
        };
      })
    );

    return solicitudesEnriquecidas;
  }


  async findOne(id: number): Promise<any> {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['formulario', 'estadoActual', 'historialDeEstados'],
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);
    }

    try {
      const [adoptanteRes, animalRes] = await Promise.all([
        firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${solicitud.adoptanteId}`)),
        firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${solicitud.animalId}`))
      ]);

      return {
        ...solicitud,
        adoptante: adoptanteRes.data, // Añadir los datos completos del usuario
        animal: animalRes.data,       // Añadir los datos completos del animal
      };
    } catch (error) {
      throw new InternalServerErrorException('No se pudieron obtener los datos completos de los otros microservicios.');
    }
  }

  async cambiarEstado(id: number, dto: CambiarEstadoDto, adminId: number): Promise<SolicitudAdopcion> {
    
    // Buscamos la solicitud y el nuevo estado
    const solicitud = await this.solicitudRepo.findOne({
        where: { id },
        relations: ['estadoActual'],
    });
    const nuevoEstado = await this.estadoRepo.findOneBy({ id: dto.nuevoEstadoId });

    if (!solicitud || !nuevoEstado) {
      throw new NotFoundException('La solicitud o el nuevo estado no fueron encontrados.');
    }
    
    const estadoAnterior = solicitud.estadoActual;

    // Guardar el historial del cambio
    const cambio = this.cambioEstadoRepo.create({
      solicitud,
      estadoAnterior: estadoAnterior,
      estadoNuevo: nuevoEstado,
      responsableId: adminId,
      motivo: dto.motivo,
    });
    await this.cambioEstadoRepo.save(cambio);

    // Actualizar el estado actual en la solicitud
    solicitud.estadoActual = nuevoEstado;
    const solicitudGuardada = await this.solicitudRepo.save(solicitud);

    let solicitudCompleta: any;
    try {
      solicitudCompleta = await this.findOne(solicitudGuardada.id);
    } catch (error) {
      this.logger.error(`No se pudieron obtener datos completos para email (Sol. ID: ${id}): ${error.message}`);
      return solicitudGuardada; 
    }

    try {
      switch (nuevoEstado.nombre) {
        case 'Aprobada':
          this.logger.log(`Disparando efectos para Solicitud ${id} Aprobada...`);
          await this.handleSolicitudAprobada(solicitudCompleta);
          break;
        
        case 'Finalizada':
          this.logger.log(`Disparando efectos for Solicitud ${id} Finalizada...`);
          await this.handleSolicitudFinalizada(solicitudGuardada, estadoAnterior, adminId);
          break;
        
        case 'Rechazada':
          await this.handleSolicitudRechazada(solicitudCompleta);
          break;
      }
    } catch (error) {
      this.logger.error(`Fallo al ejecutar efectos secundarios para solicitud ${id}: ${error.message}`, error.stack);
    }
    
    // Devolver la solicitud actualizada
    return solicitudGuardada;
  }

  // Logica para solicitud aprobada
  private async handleSolicitudAprobada(solicitud: any): Promise<void> {
    const { animalId, adoptante, animal } = solicitud;

    // Cambiar estado del animal
    try {
      const url = `${this.ANIMALES_SERVICE_URL}/${animalId}/estado`;
      const dto = { nuevoEstado: 'pendienteAdopcion' };
      await firstValueFrom(this.httpService.patch(url, dto));
      this.logger.log(`Animal ${animalId} actualizado a 'Pendiente Adopcion'`);
    } catch (error) {
      this.logger.error(`No se pudo actualizar el estado del animal ${animalId}`, error.message);
    }
    // Enviar email de notificación
    try {
      const emailDto: NotificacionSolicitudDto = {
        email: adoptante.email,
        nombreAdoptante: adoptante.nombre,
        nombreAnimal: animal.nombre
      };

      await firstValueFrom(
        this.httpService.post(`${this.CORREO_SERVICE_URL}/solicitud-aprobada`, emailDto)
            .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
      );
      this.logger.log(`Email de aprobación enviado a ${adoptante.email}`);

    } catch (error) {
      this.logger.error(`No se pudo enviar el email de aprobación a ${adoptante.email}`, error.message);
    }
 }

 private async handleSolicitudRechazada(solicitud: any): Promise<void> {
    const { adoptante, animal } = solicitud;

    try {
      const emailDto: NotificacionSolicitudDto = {
        email: adoptante.email,
        nombreAdoptante: adoptante.nombre,
        nombreAnimal: animal.nombre
      };

      await firstValueFrom(
        this.httpService.post(`${this.CORREO_SERVICE_URL}/solicitud-rechazada`, emailDto)
            .pipe(catchError(err => { throw new InternalServerErrorException(err.response?.data || err.message); }))
      );
      this.logger.log(`Email de rechazo enviado a ${adoptante.email}`);

    } catch (error) {
      this.logger.error(`No se pudo enviar el email de rechazo a ${adoptante.email}`, error.message);
    }
  }

    // Logica para solicitud finalizada
  private async handleSolicitudFinalizada(solicitud: SolicitudAdopcion, estadoAnterior: Estado, adminId: number): Promise<void> {
    const { animalId } = solicitud;

    // Cambiar estado del animal a "Adoptado"
    try {
      const url = `${this.ANIMALES_SERVICE_URL}/${animalId}/estado`;
      const dto = { nuevoEstado: 'adoptado' };
      await firstValueFrom(this.httpService.patch(url, dto));
      this.logger.log(`Animal ${animalId} actualizado a 'Adoptado'`);
    } catch (error) {
      this.logger.error(`No se pudo actualizar el estado del animal ${animalId} a 'Adoptado'`, error.message);
    }

    // Rechazar otras solicitudes pendientes para este animal
    try {
      // Buscamos los estados "Pendiente" y "Rechazada"
      const estadoPendiente = await this.estadoRepo.findOneBy({ nombre: 'Pendiente' });
      const estadoRechazada = await this.estadoRepo.findOneBy({ nombre: 'Rechazada' });
      
      if (!estadoPendiente || !estadoRechazada) {
        throw new InternalServerErrorException('Faltan estados "Pendiente" o "Rechazada" en la BD.');
      }

      // Buscamos TODAS las solicitudes de ESTE animal, que NO SEAN esta solicitud,
      // y que estén en estado "Pendiente".
      const otrasSolicitudes = await this.solicitudRepo.find({
        where: {
          animalId: animalId,
          id: Not(solicitud.id),
          estadoActual: { id: estadoPendiente.id }
        }
      });
      
      this.logger.log(`Se encontraron ${otrasSolicitudes.length} solicitudes pendientes para rechazar.`);

      const promesasRechazo = otrasSolicitudes.map(async (sol) => {
        // Creamos el historial
        const cambio = this.cambioEstadoRepo.create({
          solicitud: sol,
          estadoAnterior: estadoPendiente,
          estadoNuevo: estadoRechazada,
          responsableId: adminId,
          motivo: 'Rechazada automáticamente porque el animal ya fue adoptado.',
        });
        await this.cambioEstadoRepo.save(cambio);
        
        // Actualizamos la solicitud
        sol.estadoActual = estadoRechazada;
        return this.solicitudRepo.save(sol);
      });

      // Ejecutamos todas las actualizaciones en paralelo
      await Promise.all(promesasRechazo);
      
    } catch (error) {
      this.logger.error(`Fallo al rechazar automáticamente otras solicitudes para ${animalId}`, error.message);
    }
  }

  async findByAdoptanteId(adoptanteId: number): Promise<any[]> {
    this.logger.log(`Buscando solicitudes para adoptanteId: ${adoptanteId}`);

    const solicitudes = await this.solicitudRepo.find({
      where: { adoptanteId: adoptanteId },
      relations: ['estadoActual'], 
      order: { fechaSolicitud: 'DESC' }, 
    });

    if (solicitudes.length === 0) {
      return []; 
    }

    const solicitudesEnriquecidas = await Promise.all(
      solicitudes.map(async (solicitud) => {
        
        let animalData = { nombre: 'Animal no encontrado' };
        
        try {
          const animalRes = await firstValueFrom(
            this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${solicitud.animalId}`)
          );
          animalData = animalRes.data; 
        } catch (e) {
          this.logger.error(`[findByAdoptanteId] Error al buscar animal ${solicitud.animalId}:`, e.message);
        }

        return {
          ...solicitud,
          animal: animalData, 
        };
      })
    );

    return solicitudesEnriquecidas;
  }
}