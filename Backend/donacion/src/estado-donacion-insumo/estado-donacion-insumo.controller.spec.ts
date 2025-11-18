import { Test, TestingModule } from '@nestjs/testing';
import { EstadoDonacionInsumoController } from './estado-donacion-insumo.controller';

describe('EstadoDonacionInsumoController', () => {
  let controller: EstadoDonacionInsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoDonacionInsumoController],
    }).compile();

    controller = module.get<EstadoDonacionInsumoController>(EstadoDonacionInsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
