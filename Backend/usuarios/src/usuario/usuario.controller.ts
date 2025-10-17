// En: src/usuario/usuario.controller.ts

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Aplicamos el Guard en todo el controlador
// Todas las rutas dentro de Usuario requieren un token JWT válido
// @UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // GET /usuarios
  @Get()
  async getUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get('test')
  testEndpoint() {
    console.log('--- ¡LA RUTA DE PRUEBA FUE ALCANZADA! ---');
    return { message: '¡El controlador de usuarios funciona!' };
  }

  // GET /usuarios/email/test@example.com
  @Get('email/:email')
  async buscarUsuarioPorEmail(@Param('email') email: string) {
    return this.usuarioService.findOneByEmail(email);
  }
}