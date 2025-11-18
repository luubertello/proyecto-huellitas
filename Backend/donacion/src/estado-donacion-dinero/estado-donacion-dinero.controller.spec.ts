import { Test, TestingModule } from '@nestjs/testing';
import { EstadoDonacionDineroController } from './estado-donacion-dinero.controller';

describe('EstadoDonacionDineroController', () => {
  let controller: EstadoDonacionDineroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoDonacionDineroController],
    }).compile();

    controller = module.get<EstadoDonacionDineroController>(EstadoDonacionDineroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
