import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioService } from './usuario.service';


@Controller('usuarios')
export class UsuarioController {
  constructor(private service: UsuarioService) {}

  @Get()
  async getUsuarios(
    @Query('page') page = 1,
    @Query('quantity') quantity = 10,
  ) {
    return this.service.getUsuarios(page, quantity);
  }

  // Busca mi usuario
  @UseGuards(AuthGuard)
  @Get('me')
  getPerfil(@Req() req: RequestWithUser) {
    return {
      email: req.user!.email,
    };
  }

  // Iniciar sesion
  @UseGuards(AuthGuard)
  @Post('login')
  loginUsuario(@Body() body: LoginDTO) {
    console.log('Login request body:', body);
    return this.service.login(body);
  }

  // Registrar nuevo usuario
  @UseGuards(AuthGuard)
  @Post('register')
  registroUsuario(@Body() body: RegisterDTO) {
    return this.service.registro(body);
  }

  // Reinicia el token de acceso
  @Get('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers['refresh-token'] as string,
    );
  }
}