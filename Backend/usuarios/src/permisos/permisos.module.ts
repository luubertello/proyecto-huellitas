import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { Permisos } from './permisos.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Permisos])],
  providers: [PermisosService],
  controllers: [PermisosController],
})
export class PermisosModule {}
