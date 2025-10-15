// En: src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from 'src/DTO/login.dto';
import { RegistroDto } from 'src/DTO/registro.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

// Registra un nuevo usuario en el sistema
  async registro(registroDto: RegistroDto) {
    // Verificamos si el email ya existe
    const emailExists = await this.usuarioService.findOneByEmail(registroDto.email);
    if (emailExists) {
      throw new ConflictException('El email ya está registrado.');
    }

    return this.usuarioService.create(registroDto);
  }


  // Valida las credenciales del usuario y, si son correctas, genera un token JWT.
  async login(loginDto: LoginDto) {
    const { email, contraseña } = loginDto;
    
    // Usamos un método especial que nos trae la contraseña para comparar
    const user = await this.usuarioService.findOneByEmailWithPassword(email);

    // Si no hay usuario o la contraseña no coincide, da error
    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Creamos el payload del token con la información esencial
    const payload = { 
        sub: user.id, 
        email: user.email,
        rol: user.rol
    };
    
    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
    };
  }
}