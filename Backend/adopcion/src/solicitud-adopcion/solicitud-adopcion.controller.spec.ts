import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudAdopcionController } from './solicitud-adopcion.controller';

describe('SolicitudAdopcionController', () => {
  let controller: SolicitudAdopcionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudAdopcionController],
    }).compile();

    controller = module.get<SolicitudAdopcionController>(SolicitudAdopcionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
