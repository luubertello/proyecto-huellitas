import { Test, TestingModule } from '@nestjs/testing';
import { EstadoInsumoController } from './estado-insumo.controller';

describe('EstadoInsumoController', () => {
  let controller: EstadoInsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoInsumoController],
    }).compile();

    controller = module.get<EstadoInsumoController>(EstadoInsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
