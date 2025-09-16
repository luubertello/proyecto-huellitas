// raza.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RazaService } from './raza.service';
import { Raza } from './raza.entity';

@Controller('raza')
export class RazaController {
  constructor(private readonly razaService: RazaService) {}

  @Get()
  findAll(): Promise<Raza[]> {
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
