
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BienvenidaDto } from './dto/bienvenida.dto';
import { RecuperacionDto } from './dto/recuperacion.dto';
import { NotificacionSolicitudDto } from './dto/notificacion-solicitud.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly mailerService: MailerService) {}

// Email de Bienvenida
  async enviarBienvenida(dto: BienvenidaDto) {
    this.logger.log(`Enviando email de bienvenida a ${dto.email}...`);
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: '¡Bienvenido/a a Huellitas Adopción!',
        template: 'bienvenida', 
        context: {
          nombre: dto.nombre,
        },
      });
      this.logger.log('Email de bienvenida enviado con éxito.');
      return { message: 'Email de bienvenida enviado' };
    } catch (error) {
      this.logger.error('Error al enviar email de bienvenida:', error);
      throw error;
    }
  }

// Email de recuperación de contraseña
  async enviarRecuperacion(dto: RecuperacionDto) {
    this.logger.log(`Enviando email de recuperación a ${dto.email}...`);
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Restablece tu contraseña de Huellitas',
      template: 'recuperar-contrasena',
      context: {
        nombre: dto.nombre,
        resetLink: dto.resetLink,
      },
    });
    return { message: 'Email de recuperación enviado' };
  }


// Email de solicitud aprobada
  async enviarSolicitudAprobada(dto: NotificacionSolicitudDto) {
    this.logger.log(`Enviando email de APROBACIÓN a ${dto.email}...`);
    await this.mailerService.sendMail({
      to: dto.email,
      subject: `¡Tu solicitud de adopción para ${dto.nombreAnimal} fue aprobada!`,
      template: 'solicitud-aprobada',
      context: {
        nombreAdoptante: dto.nombreAdoptante,
        nombreAnimal: dto.nombreAnimal,
      },
    });
    return { message: 'Email de solicitud aprobada enviado' };
  }

// Email de Solicitud Rechazada
  async enviarSolicitudRechazada(dto: NotificacionSolicitudDto) {
    this.logger.log(`Enviando email de RECHAZO a ${dto.email}...`);
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Actualización sobre tu solicitud de adopción',
      template: 'solicitud-rechazada',
      context: {
        nombreAdoptante: dto.nombreAdoptante,
        nombreAnimal: dto.nombreAnimal,
      },
    });
    return { message: 'Email de solicitud rechazada enviado' };
  }
}