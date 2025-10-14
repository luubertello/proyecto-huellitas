import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestraHistoria } from './nuestra-historia';

describe('NuestraHistoria', () => {
  let component: NuestraHistoria;
  let fixture: ComponentFixture<NuestraHistoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestraHistoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestraHistoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
