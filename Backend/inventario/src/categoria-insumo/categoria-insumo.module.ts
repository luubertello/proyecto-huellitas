import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaInsumo } from './categoria-insumo.entity';
import { HttpModule } from '@nestjs/axios';
import { CategoriaInsumoService } from './categoria-insumo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaInsumo])
  ], 
  providers: [CategoriaInsumoService], 
  exports: [CategoriaInsumoService, TypeOrmModule], 
})
export class CategoriaInsumoModule {}