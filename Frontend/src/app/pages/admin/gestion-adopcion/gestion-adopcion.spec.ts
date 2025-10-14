import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAdopcion } from './gestion-adopcion';

describe('GestionAdopcion', () => {
  let component: GestionAdopcion;
  let fixture: ComponentFixture<GestionAdopcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAdopcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAdopcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
