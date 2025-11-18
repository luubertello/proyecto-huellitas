import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaInsumoController } from './categoria-insumo.controller';

describe('CategoriaInsumoController', () => {
  let controller: CategoriaInsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaInsumoController],
    }).compile();

    controller = module.get<CategoriaInsumoController>(CategoriaInsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
