import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioService } from './usuario/usuario.service';
import { RolService } from './rol/rol.service';
import { PermisosService } from './permisos/permisos.service';
import { RolController } from './rol/rol.controller';
import { PermisosController } from './permisos/permisos.controller';

@Module({
  imports: [],
  controllers: [AppController, UsuarioController, RolController, PermisosController],
  providers: [AppService, UsuarioService, RolService, PermisosService],
})
export class AppModule {}
