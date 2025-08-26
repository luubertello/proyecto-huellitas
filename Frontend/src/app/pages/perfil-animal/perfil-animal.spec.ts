import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAnimal } from './perfil-animal';

describe('PerfilAnimal', () => {
  let component: PerfilAnimal;
  let fixture: ComponentFixture<PerfilAnimal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAnimal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAnimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
