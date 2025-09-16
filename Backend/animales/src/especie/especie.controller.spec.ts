import { Test, TestingModule } from '@nestjs/testing';
import { EspecieController } from './especie.controller';

describe('EspecieController', () => {
  let controller: EspecieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspecieController],
    }).compile();

    controller = module.get<EspecieController>(EspecieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
