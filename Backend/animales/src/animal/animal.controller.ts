import { Controller, Post, Get, Param, Body, Put, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CrearAnimalDto } from '../DTO/crearAnimal.dto';
import { Animal } from './animal.entity';
import { CambiarEstadoAnimalDto } from '../DTO/cambiarEstadoAnimal.dto';

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

  // Cambiar estado del animal
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoAnimalDto, // Usamos el DTO
  ): Promise<Animal> {
    // Llamamos al nuevo método en tu servicio
    return this.animalService.cambiarEstado(id, dto.nuevoEstado);
  }

  // Eliminar animal
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.animalService.remove(+id);
  }

}
