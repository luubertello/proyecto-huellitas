// En: src/solicitud-adopcion/solicitud-adopcion.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Importa todas las entidades y DTOs necesarios
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

  constructor(
    @InjectRepository(SolicitudAdopcion) private solicitudRepo: Repository<SolicitudAdopcion>,
    @InjectRepository(FormularioAdopcion) private formularioRepo: Repository<FormularioAdopcion>,
    @InjectRepository(Estado) private estadoRepo: Repository<Estado>,
    @InjectRepository(CambioEstado) private cambioEstadoRepo: Repository<CambioEstado>,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CrearSolicitudDto, adoptanteId: number): Promise<SolicitudAdopcion> {
    const { animalId, ...formData } = dto;
    
    // Valida que el animal y el usuario existen
    try {
      await firstValueFrom(this.httpService.get(`${this.USUARIOS_SERVICE_URL}/${adoptanteId}`));
      await firstValueFrom(this.httpService.get(`${this.ANIMALES_SERVICE_URL}/${animalId}`));
    } catch (error) {
      console.error('--- ERROR ORIGINAL DE LA PETICIÓN HTTP ---');
      console.error(error.response?.data || error.message); 
      console.error('-----------------------------------------');
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


  async findAll(): Promise<SolicitudAdopcion[]> {
    return this.solicitudRepo.find({
      relations: ['estadoActual'],
      order: { fechaSolicitud: 'DESC' },
    });
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
    const solicitud = await this.solicitudRepo.findOne({
        where: { id },
        relations: ['estadoActual'],
    });
    const nuevoEstado = await this.estadoRepo.findOneBy({ id: dto.nuevoEstadoId });

    if (!solicitud || !nuevoEstado) {
      throw new NotFoundException('La solicitud o el nuevo estado no fueron encontrados.');
    }

    // Guardar el historial del cambio de estado
    const cambio = this.cambioEstadoRepo.create({
      solicitud,
      estadoAnterior: solicitud.estadoActual,
      estadoNuevo: nuevoEstado,
      responsableId: adminId,
      motivo: dto.motivo,
    });
    await this.cambioEstadoRepo.save(cambio);

    // Actualizar el estado actual en la solicitud
    solicitud.estadoActual = nuevoEstado;
    return this.solicitudRepo.save(solicitud);
  }
}