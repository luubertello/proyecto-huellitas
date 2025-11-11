import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarRecuperacion } from './solicitar-recuperacion';

describe('SolicitarRecuperacion', () => {
  let component: SolicitarRecuperacion;
  let fixture: ComponentFixture<SolicitarRecuperacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarRecuperacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarRecuperacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
