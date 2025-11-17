import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDonaciones } from './gestion-donaciones';

describe('GestionDonaciones', () => {
  let component: GestionDonaciones;
  let fixture: ComponentFixture<GestionDonaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDonaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDonaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
