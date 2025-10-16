import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-perfil-animal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-animal.html',
  styleUrl: './perfil-animal.css',
  encapsulation: ViewEncapsulation.None,
})
export class PerfilAnimal {
  animal: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.registrarSolicitudAdopcion();
  }

  registrarSolicitudAdopcion(animal:any):void {
    this.http.post('http://localhost:3000/adopta/formulario', { animalId: animal.id })
      .subscribe(error => console.error('Error al registrar adopción.', error));
}}
