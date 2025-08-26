import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonaInsumos } from './dona-insumos';

describe('DonaInsumos', () => {
  let component: DonaInsumos;
  let fixture: ComponentFixture<DonaInsumos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonaInsumos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonaInsumos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
