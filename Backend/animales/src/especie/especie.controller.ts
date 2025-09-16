// raza.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Especie } from './especie.entity';
import { EspecieService } from './especie.service';


@Controller('especie')
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}

  @Get()
  findAll(): Promise<Especie[]> {
    return this.especieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Especie> {
    return this.especieService.findOne(+id);
  }

  @Post()
  create(@Body() body: { nombre: string}): Promise<Especie> {
    return this.especieService.create(body.nombre);
  }
}