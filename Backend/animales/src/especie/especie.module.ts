import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especie } from './especie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Especie])],
  providers: [],
  controllers: [],
})
export class EspecieModule {}
