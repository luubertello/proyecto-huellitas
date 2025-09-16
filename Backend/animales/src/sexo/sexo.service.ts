import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sexo } from './sexo.entity';

@Injectable()
export class SexoService {
  constructor(
    @InjectRepository(Sexo)
    private readonly sexoRepo: Repository<Sexo>,
  ) {}

  findAll(): Promise<Sexo[]> {
    return this.sexoRepo.find();
  }

    async findOne(id: number): Promise<Sexo> {
    const sexo = await this.sexoRepo.findOne({ where: { id }});
    if (!sexo) {
        throw new Error(`Sexo con id ${id} no encontrada`);
    }
    return sexo;
    }

  create(nombre: string): Promise<Sexo> {
    const nuevoSexo = this.sexoRepo.create({ nombre});
    return this.sexoRepo.save(nuevoSexo);
  }
}