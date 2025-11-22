import { Injectable } from '@nestjs/common';
import { CategoriaInsumo } from './categoria-insumo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaInsumoService {
    constructor(
    @InjectRepository(CategoriaInsumo)
    private readonly categoriaRepo: Repository<CategoriaInsumo>,
  ) {}

  async findAll(): Promise<CategoriaInsumo[]> {
    return this.categoriaRepo.find({ 
      order: { nombre: 'ASC' } 
    });
 }
}
