import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SexoService } from './sexo.service';
import { SexoController } from './sexo.controller';
import { Sexo } from './sexo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sexo])],
  providers: [SexoService],
  controllers: [SexoController],
})
export class SexoModule {}
