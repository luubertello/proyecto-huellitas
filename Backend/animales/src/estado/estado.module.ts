import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './estado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  providers: [],
  controllers: [],
})
export class EstadoModule {}
