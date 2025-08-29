import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from './animal/animal.module';
import { CambioEstadoModule } from './cambioEstado/cambioEstado.module';
import { EstadoModule } from './estado/estado.module';
import { EspecieModule } from './especie/especie.module';


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
    EspecieModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
