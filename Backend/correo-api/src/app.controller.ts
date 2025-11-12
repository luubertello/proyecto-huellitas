
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { BienvenidaDto } from './dto/bienvenida.dto';
import { RecuperacionDto } from './dto/recuperacion.dto';
import { NotificacionSolicitudDto } from './dto/notificacion-solicitud.dto';
import { AdminNotificacionDto } from './dto/admin-notificacion.dto';
import { DonacionDineroRecibidaDto } from './dto/donacion-dinero-recibida.dto';
import { NuevaDonacionInsumoDto } from './dto/nueva-donacion-insumo.dto';
import { DonacionInsumoRecibidaDto } from './dto/donacion-insumo-recibida.dto';

@Controller('email')
export class AppController {
  constructor(private readonly appService: AppService) {}

// Mensaje de Bienvenida
  @Post('bienvenida')
  enviarBienvenida(@Body(new ValidationPipe()) dto: BienvenidaDto) {
    return this.appService.enviarBienvenida(dto);
  }

// Recuperar contrasena
  @Post('recuperacion')
  enviarRecuperacion(@Body(new ValidationPipe()) dto: RecuperacionDto) {
    return this.appService.enviarRecuperacion(dto);
  }

// Contrasena reestablecida
  @Post('contrasena-cambiada')
  enviarContrasenaCambiada(@Body(new ValidationPipe()) dto: BienvenidaDto) {
    return this.appService.enviarContrasenaCambiada(dto);
  }

// Notificar solicitud aprobada
  @Post('solicitud-aprobada')
  enviarSolicitudAprobada(@Body(new ValidationPipe()) dto: NotificacionSolicitudDto) {
    return this.appService.enviarSolicitudAprobada(dto);
  }

// Notificar solicitud rechazada
  @Post('solicitud-rechazada')
  enviarSolicitudRechazada(@Body(new ValidationPipe()) dto: NotificacionSolicitudDto) {
    return this.appService.enviarSolicitudRechazada(dto);
  }

// Notificar solicitud recibida
  @Post('solicitud-recibida')
  enviarSolicitudRecibida(@Body(new ValidationPipe()) dto: NotificacionSolicitudDto) {
    return this.appService.enviarSolicitudRecibida(dto);
  }

// Notificar nueva solicitud (admin)
  @Post('nueva-solicitud')
  enviarNuevaSolicitudAdmin(@Body(new ValidationPipe()) dto: AdminNotificacionDto) {
    return this.appService.enviarNuevaSolicitudAdmin(dto);
  }

// Notificar donacion insumo recibida
  @Post('donacion-insumo-recibida')
  donacionInsumoRecibida(@Body(new ValidationPipe()) dto: DonacionInsumoRecibidaDto) {
    return this.appService.donacionInsumoRecibida(dto);
  }

// Notificar nueva donacion insumo al admin
  @Post('nueva-donacion-insumo')
  nuevaDonacionInsumo(@Body(new ValidationPipe()) dto: NuevaDonacionInsumoDto) {
    return this.appService.nuevaDonacionInsumo(dto);
  }

// Notificar donacion dinero recibida
  @Post('donacion-dinero-recibida')
  donacionDineroRecibida(@Body(new ValidationPipe()) dto: DonacionDineroRecibidaDto) {
    return this.appService.donacionDineroRecibida(dto);
  }
}