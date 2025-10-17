import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adopcion',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './adopcion.html',
  styleUrl: './adopcion.css',
  encapsulation: ViewEncapsulation.None,
  host: { 'ngSkipHydration': 'true' }
})
export class Adopcion {

  animales: any[] = [];
  constructor(
    private http: HttpClient,
    private router: Router) {}

  ngOnInit() {
    this.cargarAnimales();
  }

  cargarAnimales() {
    this.http.get<any[]>('http://localhost:3000/animales')
      .subscribe(data => this.animales = data, 
                 error => console.error('Error al cargar animales', error));
  }

  goPerfil(animal: any): void {
    this.router.navigate(['/adopta/animal/', animal.id]);
  }
}

