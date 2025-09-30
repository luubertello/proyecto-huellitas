// raza.controller.ts
import { Controller, Get, Param, Post, Body, ParseIntPipe} from '@nestjs/common';
import { Especie } from './especie.entity';
import { EspecieService } from './especie.service';
import { Raza } from 'src/raza/raza.entity';


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

  @Get(':id/raza')
  obtenerRazas(@Param('id', ParseIntPipe) id: number): Promise<Raza[]> {
    return this.especieService.obtenerRazasPorEspecie(id);
  }

  @Post()
  create(@Body() body: { nombre: string}): Promise<Especie> {
    return this.especieService.create(body.nombre);
  }
}