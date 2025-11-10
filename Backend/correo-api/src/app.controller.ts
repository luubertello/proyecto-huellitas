
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { BienvenidaDto } from './dto/bienvenida.dto';
import { RecuperacionDto } from './dto/recuperacion.dto';
import { NotificacionSolicitudDto } from './dto/notificacion-solicitud.dto';

@Controller('email')
export class AppController {
  constructor(private readonly appService: AppService) {}

// Mensaje de Bienvenida
  @Post('enviar-bienvenida')
  enviarBienvenida(@Body(new ValidationPipe()) dto: BienvenidaDto) {
    return this.appService.enviarBienvenida(dto);
  }

// Recuperar contrasena
  @Post('enviar-recuperacion')
  enviarRecuperacion(@Body(new ValidationPipe()) dto: RecuperacionDto) {
    return this.appService.enviarRecuperacion(dto);
  }

// Notificar solicitud aprobada
  @Post('enviar-solicitud-aprobada')
  enviarSolicitudAprobada(@Body(new ValidationPipe()) dto: NotificacionSolicitudDto) {
    return this.appService.enviarSolicitudAprobada(dto);
  }

// Notificar solicitud rechazada
  @Post('enviar-solicitud-rechazada')
  enviarSolicitudRechazada(@Body(new ValidationPipe()) dto: NotificacionSolicitudDto) {
    return this.appService.enviarSolicitudRechazada(dto);
  }
}