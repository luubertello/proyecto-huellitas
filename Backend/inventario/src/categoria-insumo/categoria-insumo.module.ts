import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaInsumo } from './categoria-insumo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaInsumo])],
  exports: [TypeOrmModule],
})
export class CategoriaInsumoModule {}