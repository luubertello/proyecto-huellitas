import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitud } from './ver-solicitud';

describe('VerSolicitud', () => {
  let component: VerSolicitud;
  let fixture: ComponentFixture<VerSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSolicitud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
