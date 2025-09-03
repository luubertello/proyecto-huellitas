import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './animal.entity';
import { CrearAnimalDto } from 'src/DTO/crearAnimal.dto';
import { Especie } from 'src/especie/especie.entity';
import { Estado } from 'src/estado/estado.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(Especie)
    private readonly especieRepo: Repository<Especie>,
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  async create(dto: CrearAnimalDto): Promise<Animal> {
    const especie = await this.especieRepo.findOne({ where: { id: dto.especieId } });
    const estado = await this.estadoRepo.findOne({ where: { id: dto.estadoActualId } });

    const animal = this.animalRepo.create({
    nombre: dto.nombre,
    raza: dto.raza,
    fechaNacimiento: dto.fechaNacimiento,
    descripcion: dto.descripcion,
    foto: dto.foto,
    especie,
    estadoActual: estado,
    } as Partial<Animal>);

    return this.animalRepo.save(animal);
  }

  async findAll(): Promise<Animal[]> {
    return this.animalRepo.find({ relations: ['especie', 'estadoActual', 'cambiosEstado'] });
  }

async findOne(id: number): Promise<Animal> {
  const animal = await this.animalRepo.findOne({ 
    where: { id }, 
    relations: ['especie', 'estadoActual', 'cambiosEstado'],
  });

  if (!animal) {
    throw new Error('Animal no encontrado');
  }

  return animal;
}
}
