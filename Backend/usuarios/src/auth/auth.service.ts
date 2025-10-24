// En: src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from 'src/DTO/login.dto';
import { RegistroDto } from 'src/DTO/registro.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

// Registra un nuevo usuario en el sistema
async registro(registroDto: RegistroDto) {
    const emailExists = await this.usuarioService.emailYaRegistrado(registroDto.email); 
    
    if (emailExists) {
      throw new ConflictException('El email ya está registrado.');
    }
    return this.usuarioService.create(registroDto);
  }

  // Valida las credenciales del usuario y, si son correctas, genera un token JWT.
  async login(loginDto: LoginDto) {
    const { email, contrasena } = loginDto;
    
    const user = await this.usuarioService.findOneByEmailWithPassword(email);

    if (!user || user.contraseña === null) { 
          this.logger.warn(`Intento de login fallido para ${email} - Usuario no encontrado o sin contraseña.`);
          throw new UnauthorizedException('Credenciales incorrectas.');
        }
        
        const passwordMatches = await bcrypt.compare(contrasena, user.contraseña);

        if (!passwordMatches) {
          this.logger.warn(`Intento de login fallido para ${email} - Contraseña incorrecta.`);
          throw new UnauthorizedException('Credenciales incorrectas.');
        }

        this.logger.log(`Login exitoso para ${email}`);
        
        const accessToken = this.generateJwtToken(user); 
        
        return {
          message: 'Login exitoso',
          access_token: accessToken,
        };
    }

  async findOrCreateGoogleUser(googleProfile: {
    googleId: string;
    email: string;
    nombre: string;
    apellido: string;
  }): Promise<Usuario> { 
    
    let user = await this.usuarioService.findOneByGoogleId(googleProfile.googleId);
    
    if (!user) {
      user = await this.usuarioService.findOneByEmailWithPassword(googleProfile.email);
      
      // Si existe por email pero no tiene Google ID, lo vinculamos
      if (user) {
        await this.usuarioService.linkGoogleId(user.id, googleProfile.googleId);
      }
    }

    if (!user) {
      this.logger.log(`Creando nuevo usuario para Google ID ${googleProfile.googleId}`);
      user = await this.usuarioService.createFromGoogle({
        ...googleProfile,
        sexo: 'No especificado', 
        fechaNacimiento: new Date(),
        direccion: 'No especificada',
        telefono: '0000000000',
      });
    }

    if (!user) {
      throw new InternalServerErrorException('No se pudo encontrar o crear el usuario después de la lógica de Google Auth.');
    }
    
    return user;
  }

  public generateJwtToken(user: Usuario): string {
    const payload = { 
        sub: user.id, 
        email: user.email,
        rol: user.rol 
    };

    return this.jwtService.sign(payload);
  }
}