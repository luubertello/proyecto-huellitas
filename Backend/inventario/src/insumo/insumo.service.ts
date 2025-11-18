import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insumo } from './insumo.entity';
import { CategoriaInsumo } from '../categoria-insumo/categoria-insumo.entity';
import { CrearInsumoDto } from '../dto/crear-insumo.dto';
import { ActualizarStockDto } from '../dto/actualizar-stock.dto';

@Injectable()
export class InsumoService {
  private readonly logger = new Logger(InsumoService.name);

  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepo: Repository<Insumo>,
    @InjectRepository(CategoriaInsumo)
    private readonly categoriaRepo: Repository<CategoriaInsumo>,
  ) {}

  // --- GET /inventario ---
  async findAll(): Promise<Insumo[]> {
    return this.insumoRepo.find({ 
      relations: ['categoria'],
      order: { nombre: 'ASC' }
    });
  }

  // --- POST /inventario/insumo ---
  async create(dto: CrearInsumoDto): Promise<Insumo> {
    const { categoriaId, ...insumoData } = dto;
    
    const categoria = await this.categoriaRepo.findOneBy({ id: categoriaId });
    if (!categoria) {
      throw new NotFoundException(`La Categoría con ID ${categoriaId} no existe.`);
    }

    const nuevoInsumo = this.insumoRepo.create(insumoData);
    nuevoInsumo.categoria = categoria;

    return this.insumoRepo.save(nuevoInsumo);
  }

  // --- PATCH /inventario/:id/stock ---
  async updateStock(id: number, dto: ActualizarStockDto): Promise<Insumo> {
    const insumo = await this.insumoRepo.findOneBy({ id });
    if (!insumo) {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado.`);
    }

    insumo.stock += dto.cantidad;

    return this.insumoRepo.save(insumo);
  }

}