// En: src/usuario/usuario.controller.ts

import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards, Body, ValidationPipe, Req } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActualizarPerfilDto } from 'src/DTO/actualizar-perfil.dto';

// @UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // GET /usuarios
  @Get()
  async getUsuarios() {
    return this.usuarioService.findAll();
  }

  // GET /usuarios/1
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOneById(id);
  }

  // GET /usuarios/email/test@example.com
  @Get('email/:email')
  async buscarUsuarioPorEmail(@Param('email') email: string) {
    return this.usuarioService.findOneByEmail(email);
  }

  // Ver mi perfil
  @Get('perfil/me')
  @UseGuards(JwtAuthGuard) 
  async getPerfil(@Req() req) {
    const userId = req.user.userId; 
    return this.usuarioService.findOneById(userId);
  }

  // Actualizar mi perfil
  @Patch('perfil/me')
  @UseGuards(JwtAuthGuard) 
  async updatePerfil(
    @Req() req, 
    @Body() dto: ActualizarPerfilDto
  ) {
    const userId = req.user.userId;
    return this.usuarioService.actualizarPerfil(userId, dto);
  }
}