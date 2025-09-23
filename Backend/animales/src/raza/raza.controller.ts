// raza.controller.ts
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { RazaService } from './raza.service';
import { Raza } from './raza.entity';

@Controller('raza')
export class RazaController {
  constructor(private readonly razaService: RazaService) {}

  @Get()
  findAll(@Query('especieId') especieId: string): Promise<Raza[]> {
    if (especieId) {
      return this.razaService.findByEspecie(+especieId); // Convierte el string a number
    }
    return this.razaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Raza> {
    return this.razaService.findOne(+id);
  }

  @Post()
  create(@Body() body: { nombre: string; especieId: number }): Promise<Raza> {
    return this.razaService.create(body.nombre, body.especieId);
  }
}
