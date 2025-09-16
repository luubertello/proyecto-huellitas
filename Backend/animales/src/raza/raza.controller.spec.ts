import { Test, TestingModule } from '@nestjs/testing';
import { RazaController } from './raza.controller';

describe('RazaController', () => {
  let controller: RazaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RazaController],
    }).compile();

    controller = module.get<RazaController>(RazaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
