import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CambioEstado } from './cambioEstado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CambioEstado])],
  providers: [],
  controllers: [],
})
export class CambioEstadoModule {}
