import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { Rol } from './rol.entity';
import { Permisos } from 'src/permisos/permisos.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Rol, Permisos])],
  providers: [RolService],
  controllers: [RolController],
})
export class RolModule {}
