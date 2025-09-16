import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from './animal/animal.module';
import { CambioEstadoModule } from './cambioEstado/cambioEstado.module';
import { EstadoModule } from './estado/estado.module';
import { EspecieModule } from './especie/especie.module';
import { RazaController } from './raza/raza.controller';
import { RazaService } from './raza/raza.service';
import { SexoController } from './sexo/sexo.controller';
import { SexoService } from './sexo/sexo.service';
import { RazaModule } from './raza/raza.module';
import { SexoModule } from './sexo/sexo.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5433,
      username: 'admin',
      password: 'admin',
      database: 'animales',
      autoLoadEntities: true, 
      synchronize: true,
    }),
    AnimalModule,
    CambioEstadoModule,
    EstadoModule,
    EspecieModule,
    RazaModule,
    SexoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
