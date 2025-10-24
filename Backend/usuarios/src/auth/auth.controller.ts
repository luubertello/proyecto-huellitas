// En: src/auth/auth.controller.ts

import { Controller, Post, Body, UseGuards, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/DTO/login.dto';
import { RegistroDto } from 'src/DTO/registro.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

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

  // GET /auth/google - Redirige a Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
  }

  // GET /auth/google/callback - Google redirige aquí después de autenticar
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res) {
    
    const user = req.user; 

    if (!user) {
      return res.redirect('http://localhost:4200/iniciar-sesion?error=google_failed');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      rol: user.rol 
    };
    const accessToken = this.authService.generateJwtToken(user);

    // Redirigimos al frontend pasándole el token en la URL
    // ¡ASEGÚRATE de que /auth/callback exista en tu routing de Angular!
    res.redirect(`http://localhost:4200/auth/callback?token=${accessToken}`);
  }
}
