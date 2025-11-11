import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adopta-gatos',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './adopta-gatos.html',
  styleUrl: './adopta-gatos.css',
  encapsulation: ViewEncapsulation.None,
  host: { 'ngSkipHydration': 'true' }
})

export class AdoptaGatos {
  gatos: any[]=[];

  constructor( private http: HttpClient,
    private router: Router) {}

  ngOnInit() {
    this.cargarGatos();
  }

  cargarGatos() {
    this.http.get<any[]>('http://localhost:3000/gatos')
    .subscribe(data => this.gatos = data, 
                 error => console.error('Error al cargar gatos', error));
  }

  goPerfil(animal: any): void {
    this.router.navigate(['/adopta/gatos/', animal.id]);
  }
}

