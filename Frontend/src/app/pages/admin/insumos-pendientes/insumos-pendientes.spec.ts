import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosPendientes } from './insumos-pendientes';

describe('InsumosPendientes', () => {
  let component: InsumosPendientes;
  let fixture: ComponentFixture<InsumosPendientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosPendientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosPendientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
