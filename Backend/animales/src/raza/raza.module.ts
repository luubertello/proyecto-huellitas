import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazaService } from './raza.service';
import { RazaController } from './raza.controller';
import { Raza } from './raza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raza])],
  providers: [RazaService],
  controllers: [RazaController],
})
export class RazaModule {}
