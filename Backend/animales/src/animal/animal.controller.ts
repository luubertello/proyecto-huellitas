import { Controller } from '@nestjs/common';
import { UseGuards, Get, Post, Put, Patch, Delete, Param } from '@nestjs/common';

@Controller('animal')
export class AnimalController {
    
    // Buscar todos los animales
    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
        return this.service.findAll();
  }
  
  // Crear animal
    @UseGuards(AuthGuard)
    @Post()
    create(): string {
        return 'This action adds a new animal';
  }

  // Modificar animal
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string): string {
        return `This action updates cat with ID ${id}`;
  }

  // Modificar parcialmente animal
    @UseGuards(AuthGuard)
    @Patch(':id')
    partialUpdate(@Param('id') id: string): string {
        return `This action partially updates cat with ID ${id}`;
  }

  // Eliminar animal
    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string): string {
        return `This action removes cat with ID ${id}`;
  }
}

