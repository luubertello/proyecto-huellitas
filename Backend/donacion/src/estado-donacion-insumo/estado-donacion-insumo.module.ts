import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoDonacionInsumo } from './estado-donacion-insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoDonacionInsumo])],
  exports: [TypeOrmModule], 
})
export class EstadoDonacionInsumoModule {}
