import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adopta-gatos',
  imports: [CommonModule],
  templateUrl: './adopta-gatos.html',
  styleUrl: './adopta-gatos.css',
  encapsulation: ViewEncapsulation.None
})
export class AdoptaGatos implements OnInit {
animales: any[] = [];
  constructor(
    private http: HttpClient,
    private router: Router) {}

  ngOnInit() {
    this.cargarGatos(); 
  }

   cargarGatos() { 
    this.http.get<any[]>('http://localhost:3000/animales/gatos') 
      .subscribe(data => this.animales = data, 
            error => console.error('Error al cargar gatos', error));
  }

   goPerfil(animal: any): void {
    this.router.navigate(['/adopta/animal/', animal.id]);
  }
}

