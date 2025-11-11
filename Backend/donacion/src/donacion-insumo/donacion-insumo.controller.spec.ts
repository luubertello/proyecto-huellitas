import { Test, TestingModule } from '@nestjs/testing';
import { DonacionInsumoController } from './donacion-insumo.controller';

describe('DonacionInsumoController', () => {
  let controller: DonacionInsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonacionInsumoController],
    }).compile();

    controller = module.get<DonacionInsumoController>(DonacionInsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
