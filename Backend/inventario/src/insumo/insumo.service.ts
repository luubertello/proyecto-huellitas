// En: inventario-api/src/insumo/insumo.service.ts

import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; 
import { Insumo } from './insumo.entity';
import { CategoriaInsumo } from '../categoria-insumo/categoria-insumo.entity';
import { CrearInsumoDto } from '../dto/crear-insumo.dto';
import { ActualizarStockDto } from '../dto/actualizar-stock.dto';
import { HttpService } from '@nestjs/axios'; 
import { ConfigService } from '@nestjs/config'; 
import { firstValueFrom, catchError } from 'rxjs'; 

@Injectable()
export class InsumoService {
  private readonly logger = new Logger(InsumoService.name);
  private readonly donacionesServiceUrl: string; 

  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepo: Repository<Insumo>,
    @InjectRepository(CategoriaInsumo)
    private readonly categoriaRepo: Repository<CategoriaInsumo>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const donacionesUrl = this.configService.get<string>('DONACIONES_SERVICE_URL');
    if (!donacionesUrl) {
      throw new InternalServerErrorException('DONACIONES_SERVICE_URL no está definida en .env');
    }
    this.donacionesServiceUrl = donacionesUrl;
  }

  // --- GET /inventario ---
  async findAll(): Promise<Insumo[]> {
    return this.insumoRepo.find({ 
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });
  }

  // --- GET /inventario/buscar?q=... ---
  /**
   * Busca insumos por un término de texto (nombre o descripción)
   */
  async search(termino: string): Promise<Insumo[]> {
    if (!termino || termino.trim() === '') {
      return []; 
    }
    
    return this.insumoRepo.find({
      where: [
        { nombre: Like(`%${termino}%`) },
        { descripcion: Like(`%${termino}%`) }
      ],
      relations: ['categoria'],
      take: 10 
    });
  }


  // --- POST /inventario ---
  /**
   * Crea un nuevo ítem O suma stock si ya existe.
   */
  async create(dto: CrearInsumoDto): Promise<Insumo> {
    const { categoriaId, ...insumoData } = dto;
    
    const categoria = await this.categoriaRepo.findOneBy({ id: categoriaId });
    if (!categoria) {
      throw new NotFoundException(`La Categoría con ID ${categoriaId} no existe.`);
    }

    let insumo = await this.insumoRepo.findOne({
      where: { nombre: dto.nombre, categoria: { id: categoriaId } }
    });

    if (insumo) {
      this.logger.log(`El insumo '${dto.nombre}' ya existe. Sumando ${dto.stock} al stock.`);
      return this.updateStock(insumo.id, { cantidad: dto.stock });
    }

    const nuevoInsumo = this.insumoRepo.create(insumoData);
    nuevoInsumo.categoria = categoria;

    return this.insumoRepo.save(nuevoInsumo);
  }

  // --- PATCH /inventario/:id/stock ---
  /**
   * Suma o resta stock a un ítem existente.
   */
  async updateStock(id: number, dto: ActualizarStockDto): Promise<Insumo> {
    const insumo = await this.insumoRepo.findOneBy({ id });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado.`);
    }

    insumo.stock += dto.cantidad;

    return this.insumoRepo.save(insumo);
  }
}