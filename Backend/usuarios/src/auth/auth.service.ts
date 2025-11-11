// En: src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from 'src/DTO/login.dto';
import { RegistroDto } from 'src/DTO/registro.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/usuario.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly correoServiceUrl: string;
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
 ) {
    const url = this.configService.get<string>('CORREO_SERVICE_URL'); 
    if (!url) {
      throw new InternalServerErrorException(
        'La variable CORREO_SERVICE_URL no está definida'
      );
    }
     this.correoServiceUrl = url;
  }
// Registra un nuevo usuario en el sistema
async registro(registroDto: RegistroDto) {
    const emailExists = await this.usuarioService.emailYaRegistrado(registroDto.email); 
  
    if (emailExists) {
      throw new ConflictException('El email ya está registrado.');
    }

    const usuarioGuardado = await this.usuarioService.create(registroDto);

    try {
      this.logger.log(`Enviando email de bienvenida a ${usuarioGuardado.email}...`);
      
      const dtoEmail = {
        email: usuarioGuardado.email,
        nombre: usuarioGuardado.nombre
      };

      await firstValueFrom(
        this.httpService.post(`${this.correoServiceUrl}/bienvenida`, dtoEmail)
        .pipe(
          catchError(err => {
            throw new InternalServerErrorException(err.response?.data || err.message);
          })
        )
      );
      
      this.logger.log('¡Email de bienvenida enviado!');

    } catch (error) {
      this.logger.error(`FALLO al enviar email de bienvenida a ${usuarioGuardado.email}: ${error.message}`);
    }

    return usuarioGuardado;
  }

  // Valida las credenciales del usuario y, si son correctas, genera un token JWT.
  async login(loginDto: LoginDto) {
    const { email, contrasena } = loginDto;
    
    const user = await this.usuarioService.findOneByEmailWithPassword(email);

    if (!user || user.contrasena === null) { 
          this.logger.warn(`Intento de login fallido para ${email} - Usuario no encontrado o sin contrasena.`);
          throw new UnauthorizedException('Credenciales incorrectas.');
        }
        
        const passwordMatches = await bcrypt.compare(contrasena, user.contrasena);

        if (!passwordMatches) {
          this.logger.warn(`Intento de login fallido para ${email} - contrasena incorrecta.`);
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

// Solicita reseteo de contrasena. Envia email y genera token.
  async solicitarRecuperacion(email: string, frontendUrl: string) {
    this.logger.log(`Solicitud de recuperación para ${email}`);
    
    const usuario = await this.usuarioService.findOneByEmailWithPassword(email);

    if (!usuario || !usuario.contrasena) {
      this.logger.warn(`Solicitud de recuperación para ${email} (no encontrado o Google), devolviendo OK.`);
      return { message: 'Si tu email está registrado, recibirás un correo de recuperación.' };
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const resetToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m' 
    });

    const resetLink = `${frontendUrl}?token=${resetToken}`;

    const dtoEmail = {
      email: usuario.email,
      nombre: usuario.nombre,
      resetLink: resetLink
    };

    try {
      await firstValueFrom(
        this.httpService.post(`${this.correoServiceUrl}/email/recuperacion`, dtoEmail)
      );
      this.logger.log(`Email de recuperación enviado a ${email}`);
    } catch (error) {
      this.logger.error(`FALLO al enviar email de recuperación a ${email}: ${error.message}`);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperación.');
    }

    return { message: 'Si tu email está registrado, recibirás un correo de recuperación.' };
  }

// Reestablece contrasena usando el token
  async restablecerContrasena(token: string, nuevaContrasena: string) {
    let payload: any;
    
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });
    } catch (error) {
      this.logger.error(`Intento de restablecer con token inválido: ${error.message}`);
      throw new UnauthorizedException('El token es inválido o ha expirado.');
    }

    const nuevaContrasenaHash = await bcrypt.hash(nuevaContrasena, 10);

    let usuarioActualizado;
    try {
      usuarioActualizado = await this.usuarioService.actualizarContrasena(payload.sub, nuevaContrasenaHash);
    } catch (error) {
      this.logger.error(`Error al actualizar contraseña para usuario ${payload.sub}`);
      throw new InternalServerErrorException('Error al actualizar la contraseña.');
    }

    try {
      const dtoEmail = {
        email: usuarioActualizado.email,
        nombre: usuarioActualizado.nombre
      };
      await firstValueFrom(
        this.httpService.post(`${this.correoServiceUrl}/email/contrasena-cambiada`, dtoEmail)
      );
      this.logger.log(`Email de seguridad (contraseña cambiada) enviado a ${dtoEmail.email}`);
    } catch (error) {
      this.logger.error(`FALLO al enviar email de seguridad a ${usuarioActualizado.email}: ${error.message}`);
    }

    this.logger.log(`Contraseña actualizada para usuario ${payload.sub}`);
    return { message: 'Contraseña actualizada con éxito.' };
  }
}