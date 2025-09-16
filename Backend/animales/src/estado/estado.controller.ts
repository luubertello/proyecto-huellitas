import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Estado } from './estado.entity';
import { EstadoService } from './estado.service';


@Controller('Estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Estado> {
    return this.estadoService.findOne(+id);
  }

  @Post()
  create(@Body() body: { nombre: string}): Promise<Estado> {
    return this.estadoService.create(body.nombre);
  }
}