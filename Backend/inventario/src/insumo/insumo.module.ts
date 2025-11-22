import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insumo } from './insumo.entity';
import { InsumoController } from './insumo.controller';
import { InsumoService } from './insumo.service';
import { CategoriaInsumo } from '../categoria-insumo/categoria-insumo.entity';
import { ConfigModule } from '@nestjs/config';
import { CategoriaInsumoModule } from 'src/categoria-insumo/categoria-insumo.module';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RolesGuard } from 'src/auth/roles.guard';
import { CategoriaInsumoService } from 'src/categoria-insumo/categoria-insumo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo]), CategoriaInsumoModule, ConfigModule, HttpModule],
  providers: [InsumoService, JwtStrategy, RolesGuard],
  controllers: [InsumoController],
  exports: [TypeOrmModule],
})
export class InsumoModule {}