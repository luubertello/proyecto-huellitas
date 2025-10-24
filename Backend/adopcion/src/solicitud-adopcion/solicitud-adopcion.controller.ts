import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { SolicitudAdopcionService } from './solicitud-adopcion.service';
import { CrearSolicitudDto } from 'src/DTO/crear-solicitud.DTO';
import { CambiarEstadoDto } from 'src/DTO/cambiar-estado.DTO';
/*
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { RolesGuard } from '../common/auth/roles.guard';
import { Roles } from '../common/auth/roles.decorator';
*/

@Controller('solicitudes')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudAdopcionController {
  constructor(private readonly solicitudService: SolicitudAdopcionService) {}

// Interesado crea una nueva solicitud de adopcion
  @Post()
 // @Roles('interesado')
  crearSolicitud(@Body() crearSolicitudDto: CrearSolicitudDto, @Request() req) {
    const adoptanteId = crearSolicitudDto.adoptanteId;
    return this.solicitudService.create(crearSolicitudDto, adoptanteId);
  }

// Admin puede ver todas las solicitudes
  @Get()
  // @Roles('responsable de adopciones', 'admin general')
  findAll() {
    return this.solicitudService.findAll();
  }

// Ver detalle completo de una solicitud
  @Get(':id')
  // @Roles('responsable de adopciones', 'admin general')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.findOne(id);
  }

// Cambiar estado de la solicitud
  @Patch(':id/estado')
  // @Roles('responsable de adopciones', 'admin general')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoDto,
    @Request() req,
  ) {
      const adminId = req.user ? req.user.id : 0;
    return this.solicitudService.cambiarEstado(id, cambiarEstadoDto, adminId);
  }
}