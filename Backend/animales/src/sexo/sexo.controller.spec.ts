import { Test, TestingModule } from '@nestjs/testing';
import { SexoController } from './sexo.controller';

describe('SexoController', () => {
  let controller: SexoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SexoController],
    }).compile();

    controller = module.get<SexoController>(SexoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
