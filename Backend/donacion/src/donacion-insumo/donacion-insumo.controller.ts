// En: donaciones-api/src/donacion-insumo/donacion-insumo.controller.ts

import { Controller, Post, Body, UseGuards, Req, ValidationPipe, Get, Patch, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { DonacionInsumoService } from './donacion-insumo.service';
import { CrearDonacionInsumoDto } from '../dto/crear-donacion-insumo.dto';
import { ActualizarEstadoInsumoDto } from '../dto/actualizar-estado-insumo.dto';
import type { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

interface RequestConUsuario extends Request {
  user: {
    userId: number;
    email: string;
    rol: any; 
  };
}

@Controller('donaciones/insumos') 
export class DonacionInsumoController {
  constructor(private readonly donacionInsumoService: DonacionInsumoService) {}

// POST /donaciones/insumos
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async crearDonacion(@Body() body: any, @Req() req: RequestConUsuario) {
    const dto = plainToInstance(CrearDonacionInsumoDto, body);

    if (req.user) {
      dto.userId = req.user.userId;
    }
    console.log('Usuario autenticado:', req.user);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.donacionInsumoService.crearDonacionInsumo(dto);
}


   
// GET /donaciones/insumos
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin General', 'Responsable de Inventarios') 
  async findAll() {
    return this.donacionInsumoService.findAll();
  }


// GET /donaciones/insumos/mis-donaciones
  @Get('mis-donaciones')
 //  @UseGuards(JwtAuthGuard, RolesGuard)
 // @Roles('Interesado') 
  async findMyDonations(@Req() req: RequestConUsuario) {
    const userId = req.user.userId;
    return this.donacionInsumoService.findByUserId(userId);
  }


// PATCH /donaciones/insumos/:id/estado
  @Patch(':id/estado')
  // @UseGuards(JwtAuthGuard, RolesGuard)
 // @Roles('Admin General', 'Responsable de Inventarios')
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) dto: ActualizarEstadoInsumoDto 
  ) {
    return this.donacionInsumoService.actualizarEstado(id, dto);
  }
}