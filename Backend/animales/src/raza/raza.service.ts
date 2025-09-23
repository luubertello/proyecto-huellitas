import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Raza } from './raza.entity';

@Injectable()
export class RazaService {
  constructor(
    @InjectRepository(Raza)
    private readonly razaRepo: Repository<Raza>,
  ) {}

  findAll(): Promise<Raza[]> {
    return this.razaRepo.find({ relations: ['especie'] });
  }

  async findByEspecie(especieId: number): Promise<Raza[]> {
    return this.razaRepo.find({
      where: { especie: { id: especieId } },
      relations: ['especie'],
    });
  }

    async findOne(id: number): Promise<Raza> {
    const raza = await this.razaRepo.findOne({ where: { id }, relations: ['especie'] });
    if (!raza) {
        throw new Error(`Raza con id ${id} no encontrada`);
    }
    return raza;
    }

  create(nombre: string, especieId: number): Promise<Raza> {
    const nuevaRaza = this.razaRepo.create({ nombre, especie: { id: especieId } });
    return this.razaRepo.save(nuevaRaza);
  }
}
