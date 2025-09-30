import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especie } from './especie.entity';
import { Raza } from 'src/raza/raza.entity';

@Injectable()
export class EspecieService {
  constructor(
    @InjectRepository(Especie)
    private readonly especieRepo: Repository<Especie>,
    @InjectRepository(Raza)
    private readonly razaRepo: Repository<Raza>,
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

  async obtenerRazasPorEspecie(especieId: number): Promise<Raza[]> {
    return this.razaRepo.find({
      where: { especie: { id: especieId } },
    });
  }

  create(nombre: string): Promise<Especie> {
    const nuevaEspecie = this.especieRepo.create({ nombre});
    return this.especieRepo.save(nuevaEspecie);
  }
}