import { Module } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoController } from './cambio-estado.controller';

@Module({
  providers: [CambioEstadoService],
  controllers: [CambioEstadoController]
})
export class CambioEstadoModule {}
