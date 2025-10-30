import { Controller, Get, Param, Post, Body, ParseIntPipe } from '@nestjs/common';
import { Estado } from './estado.entity';
import { EstadoService } from './estado.service';
import { CrearEstadoDto } from '../DTO/crearEstado.dto';

@Controller('estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Estado> {
    return this.estadoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CrearEstadoDto): Promise<Estado> { 
    return this.estadoService.create(dto.nombre);
  }
}
