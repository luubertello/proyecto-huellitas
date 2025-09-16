import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './estado.entity';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  providers: [EstadoService],
  controllers: [EstadoController],
})
export class EstadoModule {}
