import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  findAll(): Promise<Estado[]> {
    return this.estadoRepo.find();
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepo.findOne({ where: { id } });
    if (!estado) {
      throw new NotFoundException(`Estado con id ${id} no encontrado`);
    }
    return estado;
  }

  create(nombre: string): Promise<Estado> {
    const nuevoEstado = this.estadoRepo.create({ nombre });
    return this.estadoRepo.save(nuevoEstado);
  }
}
