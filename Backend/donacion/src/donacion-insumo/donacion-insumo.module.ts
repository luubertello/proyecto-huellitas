import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoDonacionInsumo } from 'src/estado-donacion-insumo/estado-donacion-insumo.entity';
import { EstadoDonacionInsumoModule } from 'src/estado-donacion-insumo/estado-donacion-insumo.module';
import { DonacionInsumo } from './donacion-insumo.entity';
import { DonacionInsumoService } from './donacion-insumo.service';
import { DonacionInsumoController } from './donacion-insumo.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonacionInsumo, EstadoDonacionInsumo]),
    EstadoDonacionInsumoModule, 
    HttpModule,          
  ],
  providers: [DonacionInsumoService],
  controllers: [DonacionInsumoController],
})
export class DonacionInsumoModule {}
