import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './animal.entity';
import { CrearAnimalDto } from '../DTO/crearAnimal.dto';
import { Especie } from '../especie/especie.entity';
import { Estado } from '../estado/estado.entity';
import { Raza } from '../raza/raza.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(Especie)
    private readonly especieRepo: Repository<Especie>,
    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
    @InjectRepository(Raza)
    private readonly razaRepo: Repository<Raza>,
  ) {}

  // Buscar todos los animales
  async findAll(): Promise<Animal[]> {
    return this.animalRepo.find({ relations: ['especie', 'estadoActual', 'raza', 'cambiosEstado'] });
  }
  
  // Buscar animal por ID
  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepo.findOne({ 
        where: { id }, 
        relations: ['especie', 'estadoActual', 'raza', 'cambiosEstado'],
    });

    // Si no existe animal con esa ID, tira error
    if (!animal) {
        throw new NotFoundException('Animal no encontrado');
    }

    return animal;
  }

  // Buscar todos los gatos
  async findGatos(): Promise<Animal[]> {
    return this.animalRepo.find({
      where: {
        especie: {
          nombre: 'Gato' 
        },
        estadoActual: {
          nombre: 'enAdopcion' 
        }
      },
      relations: ['especie', 'estadoActual', 'raza'],
    });
  }

  // Buscar todos los perros
  async findPerros(): Promise<Animal[]> {

    return this.animalRepo.find({
      where: {
        especie: {
          nombre: 'Perro'
        },
        estadoActual: {
          nombre: 'enAdopcion'
        }
      },
      relations: ['especie', 'estadoActual', 'raza'],
    });
  }

  // Crear animal
  async create(dto: CrearAnimalDto): Promise<Animal> {
    const especie = await this.especieRepo.findOne({ where: { id: dto.especieId } });
    const estado = await this.estadoRepo.findOne({ where: { id: dto.estadoActualId } });
    const raza = await this.razaRepo.findOne({ where: { id: dto.razaId } });

    const animal = this.animalRepo.create({
    nombre: dto.nombre,
    raza,
    sexo: dto.sexo,
    fechaNacimiento: dto.fechaNacimiento,
    descripcion: dto.descripcion,
    foto: dto.foto,
    especie,
    estadoActual: estado,
    } as Partial<Animal>);

    return this.animalRepo.save(animal);
  }

  // Actualizar datos
async update(id: number, dto: Partial<CrearAnimalDto>): Promise<Animal> {
    const animal = await this.findOne(id);

    if (dto.nombre) {
      animal.nombre = dto.nombre;
    }
    if (dto.sexo) {
      animal.sexo = dto.sexo;
    }
    if (dto.fechaNacimiento) {
      animal.fechaNacimiento = dto.fechaNacimiento;
    }
    if (dto.descripcion) {
      animal.descripcion = dto.descripcion;
    }
    if (dto.foto) {
      animal.foto = dto.foto;
    }

    if (dto.estadoActualId) {
      animal.estadoActual = { id: dto.estadoActualId } as Estado;
    }
    if (dto.razaId) {
      animal.raza = { id: dto.razaId } as Raza;
    }
    if (dto.especieId) {
      animal.especie = { id: dto.especieId } as Especie;
    }

    await this.animalRepo.save(animal);


    return this.findOne(id);
  }

  // Cambiar estado
  async cambiarEstado(id: number, nombreNuevoEstado: string): Promise<Animal> {
    
    // Buscar el animal
    const animal = await this.animalRepo.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal con ID ${id} no encontrado.`);
    }

    // Buscar la entidad del nuevo estado por su nombre
    const nuevoEstado = await this.estadoRepo.findOneBy({ nombre: nombreNuevoEstado });
    if (!nuevoEstado) {
      throw new InternalServerErrorException(`El estado "${nombreNuevoEstado}" no está configurado en la base de datos de Animales.`);
    }

    // agregar logica para guardar cambio de estado

    // Asignar el nuevo estado y guardar
    animal.estadoActual = nuevoEstado;
    
    return this.animalRepo.save(animal);
  }

// Eliminar animal
    async remove(id: number): Promise<void> {
        const animal = await this.findOne(id); // validamos que exista
        await this.animalRepo.remove(animal);
    }
}
