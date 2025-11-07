// En: src/solicitud-adopcion/solicitud-adopcion.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SolicitudAdopcion } from './solicitud-adopcion.entity';
import { FormularioAdopcion } from '../formulario-adopcion/formulario-adopcion.entity';
import { Estado } from '../estado/estado.entity';
import { CambioEstado } from '../cambio-estado/cambio-estado.entity';
import { CrearSolicitudDto } from '../DTO/crear-solicitud.DTO';
import { CambiarEstadoDto } from '../DTO/cambiar-estado.DTO';

@Injectable()
export class SolicitudAdopcionService {
  private readonly USUARIOS_SERVICE_URL = 'http://usuarios-api:3000/usuarios';
  private readonly ANIMALES_SERVICE_URL = 'http://animales-api:3000/animales';
  // servicio de notificaciones x mail

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
    this.logger.log(`[DEBUG] Iniciando 'create' para adoptanteId: ${adoptanteId}`);
    this.logger.log(`[DEBUG] El animalId del DTO es: ${animalId}`);
    // Valida que el animal y el usuario existen
    try {
      await firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${adoptanteId}`));
      await firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${animalId}`));
     } catch (error) {
      console.error('--- ERROR ORIGINAL DE LA PETICIÓN HTTP ---');
      console.error(error.response?.data || error.message); 
      throw new NotFoundException('El usuario o el animal especificado no existe.');
    }
    // Obtiene el estado inicial ("Pendiente")
    const estadoInicial = await this.estadoRepo.findOne({ where: { nombre: 'Pendiente' } });
    if (!estadoInicial) {
      throw new InternalServerErrorException('El estado inicial "Pendiente" no está configurado en la base de datos.');
    }

    // Crea y guarda el formulario en la BD
    const nuevoFormulario = this.formularioRepo.create(formData);
    const formularioGuardado = await this.formularioRepo.save(nuevoFormulario);

    // Crea la solicitud principal usando el formulario recién guardado
    const nuevaSolicitud = this.solicitudRepo.create({
    adoptanteId: adoptanteId,
    animalId: animalId,
    formulario: formularioGuardado,
    estadoActual: estadoInicial,
    });

    // Guarda y devuelve la solicitud
    return this.solicitudRepo.save(nuevaSolicitud);
}

// Busca todas las solicitudes
  async findAll(): Promise<any[]> { 
    // 1. Obtenemos todas las solicitudes de nuestra BD
    const solicitudes = await this.solicitudRepo.find({
      relations: ['estadoActual'], // Mantenemos las relaciones que tenías
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
          animalData = animalRes.data; // Guardamos el objeto completo del animal
        } catch (e) {
          console.error(`[findAll] Error al buscar animal ${solicitud.animalId}:`, e.message);
        }

        try {
          const adoptanteRes = await firstValueFrom(
      this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${solicitud.adoptanteId}`)
          );
          adoptanteData = adoptanteRes.data; // Guardamos el objeto completo del adoptante
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
    // Obtener la solicitud de la base de datos local
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['formulario', 'estadoActual', 'historialDeEstados'],
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);
    }

    // Agregar datos de otros microservicios
    try {
      const [adoptanteRes, animalRes] = await Promise.all([
        firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${solicitud.adoptanteId}`)),
        firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${solicitud.animalId}`))
      ]);

      // Combinar todo en una única respuesta
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

    try {
      switch (nuevoEstado.nombre) {
        case 'Aprobada':
          this.logger.log(`Disparando efectos para Solicitud ${id} Aprobada...`);
          await this.handleSolicitudAprobada(solicitudGuardada);
          break;
        
        case 'Finalizada':
          this.logger.log(`Disparando efectos for Solicitud ${id} Finalizada...`);
          await this.handleSolicitudFinalizada(solicitudGuardada, estadoAnterior, adminId);
          break;
        
        case 'Rechazada':
          // enviar notificaicon por mail
          break;
      }
    } catch (error) {
      this.logger.error(`Fallo al ejecutar efectos secundarios para solicitud ${id}: ${error.message}`, error.stack);
    }
    
    // Devolver la solicitud actualizada
    return solicitudGuardada;
  }

  // Logica para solicitud aprobada
  private async handleSolicitudAprobada(solicitud: SolicitudAdopcion): Promise<void> {
    const { animalId, adoptanteId } = solicitud;

    // Cambiar estado del animal
    try {
      // ASUMO que tu endpoint de animales es: PATCH /animales/:id/estado
      const url = `${this.ANIMALES_SERVICE_URL}/${animalId}/estado`;
      const dto = { nuevoEstado: 'pendienteAdopcion' };
      await firstValueFrom(this.httpService.patch(url, dto));
      this.logger.log(`Animal ${animalId} actualizado a 'Pendiente Adopcion'`);
    } catch (error) {
      this.logger.error(`No se pudo actualizar el estado del animal ${animalId}`, error.message);
    }
  }

    /* Enviar email de notificación
    try {
      // Necesitamos los datos del adoptante (email) y animal (nombre)
      const adoptante = (await firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${adoptanteId}`))).data;
      const animal = (await firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${animalId}`))).data;

      const emailDto = {
        to: adoptante.email,
        subject: `¡Tu solicitud de adopción para ${animal.nombre} fue aprobada!`,
        body: `Hola ${adoptante.nombre}, ¡felicidades! Tu solicitud ha sido aprobada. Por favor, contáctanos para coordinar la reunión y el retiro.`
      };
      
      // Llamamos al (hipotético) servicio de notificaciones
      await firstValueFrom(this.httpService.post(this.NOTIFICACIONES_SERVICE_URL, emailDto));
      this.logger.log(`Email de aprobación enviado a ${adoptante.email}`);

    } catch (error) {
      this.logger.error(`No se pudo enviar el email de aprobación a ${adoptanteId}`, error.message);
    }
  }
    */

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
}