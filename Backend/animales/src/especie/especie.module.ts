import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especie } from './especie.entity';
import { EspecieService } from './especie.service';
import { EspecieController } from './especie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Especie])],
  providers: [EspecieService],
  controllers: [EspecieController],
})
export class EspecieModule {}
