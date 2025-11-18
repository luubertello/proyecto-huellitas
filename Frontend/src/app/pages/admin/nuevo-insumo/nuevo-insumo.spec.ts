import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoInsumo } from './nuevo-insumo';

describe('NuevoInsumo', () => {
  let component: NuevoInsumo;
  let fixture: ComponentFixture<NuevoInsumo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoInsumo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoInsumo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
