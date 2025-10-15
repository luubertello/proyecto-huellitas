// En: src/auth/auth.controller.ts

import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/DTO/login.dto';
import { RegistroDto } from 'src/DTO/registro.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/registro - Endpoint público
  @Post('registro')
  async registro(@Body() registroDto: RegistroDto) {
    return this.authService.registro(registroDto);
  }

  // POST /auth/login - Endpoint público
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /auth/renew-token - Endpoint protegido
  // Renueva el token para mantener la sesión activa.
  @UseGuards(JwtAuthGuard)
  @Get('renew-token')
  async renewToken(@Request() req) {
    // req.user es el payload del token que el JwtAuthGuard ya validó
    return this.authService.login(req.user);
  }
}