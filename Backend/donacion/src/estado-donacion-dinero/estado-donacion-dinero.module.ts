import { Module } from '@nestjs/common';
import { EstadoDonacionDineroController } from './estado-donacion-dinero.controller';
import { EstadoDonacionDineroService } from './estado-donacion-dinero.service';

@Module({
  controllers: [EstadoDonacionDineroController],
  providers: [EstadoDonacionDineroService]
})
export class EstadoDonacionDineroModule {}
