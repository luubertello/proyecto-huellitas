import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormularioAdopcion } from './formulario-adopcion.entity';
import { FormularioAdopcionController } from './formulario-adopcion.controller';
import { FormularioAdopcionService } from './formulario-adopcion.service';
import { SolicitudAdopcionModule } from 'src/solicitud-adopcion/solicitud-adopcion.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FormularioAdopcion, SolicitudAdopcionModule]),
  ],
  controllers: [FormularioAdopcionController],
  providers: [FormularioAdopcionService],
})
export class FormularioAdopcionModule {}