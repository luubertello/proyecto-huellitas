import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SolicitudAdopcionController } from './solicitud-adopcion/solicitud-adopcion.controller';
import { SolicitudAdopcionService } from './solicitud-adopcion/solicitud-adopcion.service';
import { SolicitudAdopcionModule } from './solicitud-adopcion/solicitud-adopcion.module';
import { EstadoModule } from './estado/estado.module';
import { CambioEstadoModule } from './cambio-estado/cambio-estado.module';
import { FormularioAdopcionController } from './formulario-adopcion/formulario-adopcion.controller';
import { FormularioAdopcionService } from './formulario-adopcion/formulario-adopcion.service';
import { FormularioAdopcionModule } from './formulario-adopcion/formulario-adopcion.module';

@Module({
  imports: [SolicitudAdopcionModule, EstadoModule, CambioEstadoModule, FormularioAdopcionModule],
  controllers: [AppController, SolicitudAdopcionController, FormularioAdopcionController],
  providers: [AppService, SolicitudAdopcionService, FormularioAdopcionService],
})
export class AppModule {}
