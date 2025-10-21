import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudAdopcion } from './solicitud-adopcion.entity';
import { FormularioAdopcion } from 'src/formulario-adopcion/formulario-adopcion.entity';
import { SolicitudAdopcionController } from './solicitud-adopcion.controller';
import { SolicitudAdopcionService } from './solicitud-adopcion.service';
import { Estado } from 'src/estado/estado.entity';
import { CambioEstado } from 'src/cambio-estado/cambio-estado.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SolicitudAdopcion, FormularioAdopcion, Estado, CambioEstado]),
  ],
  controllers: [SolicitudAdopcionController],
  providers: [SolicitudAdopcionService],
})
export class SolicitudAdopcionModule {}