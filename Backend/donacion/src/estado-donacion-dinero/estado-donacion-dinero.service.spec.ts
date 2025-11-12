import { Test, TestingModule } from '@nestjs/testing';
import { EstadoDonacionDineroService } from './estado-donacion-dinero.service';

describe('EstadoDonacionDineroService', () => {
  let service: EstadoDonacionDineroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadoDonacionDineroService],
    }).compile();

    service = module.get<EstadoDonacionDineroService>(EstadoDonacionDineroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
