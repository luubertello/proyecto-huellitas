import { Controller, Post, Get, Param, Body, Put, Patch, Delete } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CrearAnimalDto } from 'src/DTO/crearAnimal.dto';
import { Animal } from './animal.entity';

@Controller('animales')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  // Buscar todos los animales
  @Get()
  findAll(): Promise<Animal[]> {
    return this.animalService.findAll();
  }

  // Buscar animal por ID
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Animal> {
    return this.animalService.findOne(+id);
  }

  // Crear animal
  @Post()
  create(@Body() dto: CrearAnimalDto): Promise<Animal> {
    return this.animalService.create(dto);
  }


// Actualizar todos los datos de animal
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CrearAnimalDto): Promise<Animal> {
    return this.animalService.update(+id, dto);
  }

  // Actualizar parcialmente los datos de animal
  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: Partial<CrearAnimalDto>): Promise<Animal> {
    return this.animalService.update(+id, dto);
  }

  // Eliminar animal
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(+id);
  }

}
