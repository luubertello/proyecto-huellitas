import { Test, TestingModule } from '@nestjs/testing';
import { InsumoController } from './insumo.controller';

describe('InsumoController', () => {
  let controller: InsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumoController],
    }).compile();

    controller = module.get<InsumoController>(InsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
