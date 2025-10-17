import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudAdopcionService } from './solicitud-adopcion.service';

describe('SolicitudAdopcionService', () => {
  let service: SolicitudAdopcionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitudAdopcionService],
    }).compile();

    service = module.get<SolicitudAdopcionService>(SolicitudAdopcionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
