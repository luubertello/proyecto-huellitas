import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

export interface Especie {
  id: number;
  nombre: string;
}

export interface Raza {
  id: number;
  nombre: string;
}

export interface Animal {
  id: number;
  nombre: string;
  foto: string;
  especie: Especie; 
  raza: Raza;    
  fechaNacimiento: Date;
  sexo: string;
  descripcion: string;
}

@Component({
  selector: 'app-perfil-animal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-animal.html',
  styleUrl: './perfil-animal.css',
  encapsulation: ViewEncapsulation.None,
})
export class PerfilAnimal implements OnInit {
  public animal?: Animal;
  private apiUrl = 'http://localhost:3000/animales';

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarAnimal(id);
    });
  }

  cargarAnimal(id: number): void {
    if (!id) return;

    const url = `${this.apiUrl}/${id}`; // Construye la URL final, ej: http://localhost:3000/animales/123

    this.http.get<Animal>(url).subscribe({
      // Si la llamada es exitosa
      next: (animalRecibido) => {
        this.animal = animalRecibido;
      },
      error: (err) => {
        console.error(`Error al cargar el animal con ID ${id}`, err);
        // Si no se encuentra el animal, redirigimos a otra página
        this.router.navigate(['/']);
      }
    });
  }
  registrarSolicitudAdopcion(animal:any):void {
   this.router.navigate(['/adopta/formulario']); 
  }
}
