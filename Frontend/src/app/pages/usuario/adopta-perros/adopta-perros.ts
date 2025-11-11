import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adopta-perros',
  imports: [CommonModule],
  templateUrl: './adopta-perros.html',
  styleUrl: './adopta-perros.css'
})
export class AdoptaPerros implements OnInit {
animales: any[] = [];
  constructor(
    private http: HttpClient,
    private router: Router) {}

  ngOnInit() {
    this.cargarGatos(); 
  }

   cargarGatos() { 
    this.http.get<any[]>('http://localhost:3000/animales/perros') 
      .subscribe(data => this.animales = data, 
            error => console.error('Error al cargar perros', error));
  }

   goPerfil(animal: any): void {
    this.router.navigate(['/adopta/animal/', animal.id]);
  }
}
