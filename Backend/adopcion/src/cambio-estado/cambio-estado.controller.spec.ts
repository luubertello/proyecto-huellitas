import { Test, TestingModule } from '@nestjs/testing';
import { CambioEstadoController } from './cambio-estado.controller';

describe('CambioEstadoController', () => {
  let controller: CambioEstadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CambioEstadoController],
    }).compile();

    controller = module.get<CambioEstadoController>(CambioEstadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
