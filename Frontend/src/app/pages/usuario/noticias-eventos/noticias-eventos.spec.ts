import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasEventos } from './noticias-eventos';

describe('NoticiasEventos', () => {
  let component: NoticiasEventos;
  let fixture: ComponentFixture<NoticiasEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasEventos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasEventos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
