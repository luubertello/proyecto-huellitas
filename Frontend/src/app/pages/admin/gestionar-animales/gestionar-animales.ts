import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-gestionar-animales',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './gestionar-animales.html',
  styleUrl: './gestionar-animales.css',
  encapsulation: ViewEncapsulation.None,
  host: { 'ngSkipHydration': 'true' }
})
export class GestionarAnimales {
  animales: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAnimales();
  }

  cargarAnimales() {
    this.http.get<any[]>('http://localhost:3000/animales')
      .subscribe(data => this.animales = data, 
                 error => console.error('Error al cargar animales', error));
  }
}
