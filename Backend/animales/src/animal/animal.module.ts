import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { Estado } from '../estado/estado.entity';
import { Especie } from '../especie/especie.entity';
import { Raza } from '../raza/raza.entity';
import { Sexo } from '../sexo/sexo.entity';
import { CambioEstado } from '../cambioEstado/cambioEstado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Estado, Especie, Raza, Sexo, CambioEstado])],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
