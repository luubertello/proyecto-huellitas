
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BienvenidaDto } from './dto/bienvenida.dto';
import { RecuperacionDto } from './dto/recuperacion.dto';
import { NotificacionSolicitudDto } from './dto/notificacion-solicitud.dto';
import { AdminNotificacionDto } from './dto/admin-notificacion.dto';

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

// Email de notificacion de cambio de contrasena
  async enviarContrasenaCambiada(dto: BienvenidaDto) { 
    this.logger.log(`Enviando email de cambio de contraseña a ${dto.email}...`);
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Tu contraseña de Huellitas ha sido actualizada',
        template: 'contrasena-cambiada',
        context: {
          nombre: dto.nombre,
        },
      });
      this.logger.log('Email de seguridad enviado con éxito.');
      return { message: 'Email de seguridad enviado' };
    } catch (error) {
      this.logger.error('Error al enviar email de seguridad:', error);
      throw error;
    }
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

// Email de Solicitud recibida
  async enviarSolicitudRecibida(dto: NotificacionSolicitudDto) {
    this.logger.log(`Enviando email de 'Solicitud Recibida' a ${dto.email}...`);
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: `¡Recibimos tu solicitud para adoptar a ${dto.nombreAnimal}!`,
        template: 'solicitud-recibida', 
        context: {
          nombreAdoptante: dto.nombreAdoptante,
          nombreAnimal: dto.nombreAnimal,
        },
      });
      this.logger.log('Email de "Solicitud Recibida" enviado.');
      return { message: 'Email de solicitud recibida enviado' };
    } catch (error) {
      this.logger.error('Error al enviar "Solicitud Recibida":', error);
      throw error;
    }
  }

// Email de nueva solicitud (Admin)
  async enviarNuevaSolicitudAdmin(dto: AdminNotificacionDto) {
    this.logger.log(`Enviando email de 'Nueva Solicitud (Admin)' a ${dto.emailAdmin}...`);
    try {
      await this.mailerService.sendMail({
        to: dto.emailAdmin, 
        subject: `¡Nueva Solicitud! (${dto.nombreAdoptante} quiere adoptar a ${dto.nombreAnimal})`,
        template: 'nueva-solicitud',
        context: {
          nombreAdoptante: dto.nombreAdoptante,
          nombreAnimal: dto.nombreAnimal,
          email: dto.emailAdoptante,
        },
      });
      this.logger.log('Email de "Nueva Solicitud (Admin)" enviado.');
      return { message: 'Email de nueva solicitud (admin) enviado' };
    } catch (error) {
      this.logger.error('Error al enviar "Nueva Solicitud (Admin)":', error);
      throw error;
    }
  }
}