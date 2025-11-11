import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPagoController } from './estado-pago.controller';

describe('EstadoPagoController', () => {
  let controller: EstadoPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoPagoController],
    }).compile();

    controller = module.get<EstadoPagoController>(EstadoPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
