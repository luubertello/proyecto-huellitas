import { Test, TestingModule } from '@nestjs/testing';
import { EstadoPagoService } from './estado-pago.service';

describe('EstadoPagoService', () => {
  let service: EstadoPagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoPagoService],
    }).compile();

    service = module.get<EstadoPagoService>(EstadoPagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
