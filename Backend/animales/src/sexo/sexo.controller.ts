import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Sexo } from './sexo.entity';
import { SexoService } from './sexo.service';


@Controller('sexo')
export class SexoController {
  constructor(private readonly sexoService: SexoService) {}

  @Get()
  findAll(): Promise<Sexo[]> {
    return this.sexoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sexo> {
    return this.sexoService.findOne(+id);
  }

  @Post()
  create(@Body() body: { nombre: string}): Promise<Sexo> {
    return this.sexoService.create(body.nombre);
  }
}