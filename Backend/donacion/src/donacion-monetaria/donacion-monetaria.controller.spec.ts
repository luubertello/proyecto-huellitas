import { Test, TestingModule } from '@nestjs/testing';
import { DonacionMonetariaController } from './donacion-monetaria.controller';

describe('DonacionMonetariaController', () => {
  let controller: DonacionMonetariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonacionMonetariaController],
    }).compile();

    controller = module.get<DonacionMonetariaController>(DonacionMonetariaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
