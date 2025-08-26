import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalController } from './animal/animal.controller';
import { AnimalService } from './animal/animal.service';

@Module({
  imports: [],
  controllers: [AppController, AnimalController],
  providers: [AppService, AnimalService],
})
export class AppModule {}
