import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { Estado } from 'src/estado/estado.entity';
import { Especie } from 'src/especie/especie.entity';
import { Raza } from 'src/raza/raza.entity';
import { Sexo } from 'src/sexo/sexo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Estado, Especie, Raza, Sexo])],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
