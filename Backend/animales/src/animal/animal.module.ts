import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { Estado } from 'src/estado/estado.entity';
import { Especie } from 'src/especie/especie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Estado, Especie])],
  providers: [AnimalService],
  controllers: [AnimalController],
})
export class AnimalModule {}
