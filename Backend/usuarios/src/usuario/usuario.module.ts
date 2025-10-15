import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { Rol } from 'src/rol/rol.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService]
})
export class UsuarioModule {}
