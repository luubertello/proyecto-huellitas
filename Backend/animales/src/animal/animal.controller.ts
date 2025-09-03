import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CrearAnimalDto } from 'src/DTO/crearAnimal.dto';
import { Animal } from './animal.entity';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  create(@Body() dto: CrearAnimalDto): Promise<Animal> {
    return this.animalService.create(dto);
  }

  @Get()
  findAll(): Promise<Animal[]> {
    return this.animalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Animal> {
    return this.animalService.findOne(+id);
  }
}
