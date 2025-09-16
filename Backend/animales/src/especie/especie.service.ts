import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especie } from './especie.entity';

@Injectable()
export class EspecieService {
  constructor(
    @InjectRepository(Especie)
    private readonly especieRepo: Repository<Especie>,
  ) {}

  findAll(): Promise<Especie[]> {
    return this.especieRepo.find();
  }

    async findOne(id: number): Promise<Especie> {
    const especie = await this.especieRepo.findOne({ where: { id }});
    if (!especie) {
        throw new Error(`Especie con id ${id} no encontrada`);
    }
    return especie;
    }

  create(nombre: string): Promise<Especie> {
    const nuevaEspecie = this.especieRepo.create({ nombre});
    return this.especieRepo.save(nuevaEspecie);
  }
}