import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especie } from './especie.entity';
import { EspecieService } from './especie.service';
import { EspecieController } from './especie.controller';
import { Raza } from 'src/raza/raza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especie, Raza])],
  providers: [EspecieService],
  controllers: [EspecieController],
})
export class EspecieModule {}
