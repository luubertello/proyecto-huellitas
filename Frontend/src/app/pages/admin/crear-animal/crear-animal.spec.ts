import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAnimal } from './crear-animal';

describe('CrearAnimal', () => {
  let component: CrearAnimal;
  let fixture: ComponentFixture<CrearAnimal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearAnimal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAnimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
