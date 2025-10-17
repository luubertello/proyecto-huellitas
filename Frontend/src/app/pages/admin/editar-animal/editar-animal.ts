import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-editar-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-animal.html',
  styleUrl: './editar-animal.css',
  encapsulation: ViewEncapsulation.None,
})
export class EditarAnimal implements OnInit {
  public animal?: Animal;
  private apiUrl = 'http://localhost:3000/animales';

  public animalForm: FormGroup;
  
  // Listas para los selectores
  public especies: Especie[] = []; 
  public razas: Raza[] = [];

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.animalForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      foto: new FormControl('', [Validators.required]),
      especie: new FormControl(null, [Validators.required]),
      raza: new FormControl(null, [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    });
  }

  ngOnInit(): void {
    this.cargarEspecies();

    this.animalForm.get('especie')?.valueChanges.subscribe(especieId => {
      this.onEspecieChange(especieId);
    });

    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarAnimal(id);
    });
  }

  cargarAnimal(id: number): void {
    if (!id) return;
    const url = `${this.apiUrl}/${id}`;

    this.http.get<Animal>(url).subscribe({
      next: (animalRecibido) => {
        this.animal = animalRecibido;
        this.animalForm.patchValue({
          id: animalRecibido.id,
          nombre: animalRecibido.nombre,
          foto: animalRecibido.foto,
          especie: animalRecibido.especie.id,
          raza: animalRecibido.raza.id,
          fechaNacimiento: new Date(animalRecibido.fechaNacimiento).toISOString().split('T')[0],
          sexo: animalRecibido.sexo,
          descripcion: animalRecibido.descripcion,
        });
        
        this.onEspecieChange(animalRecibido.especie.id, true);
      },
      error: (err) => {
        console.error(`Error al cargar el animal con ID ${id}`, err);
        this.router.navigate(['/']);
      }
    });
  }

  cargarEspecies(): void {
    this.http.get<Especie[]>('http://localhost:3000/especie').subscribe(data => {
      this.especies = data;
    });
  }

  onEspecieChange(especieId: number, esCargaInicial: boolean = false): void {
    const razaControl = this.animalForm.get('raza');
    
    if (especieId) {
      // Reemplaza '/raza' por tu endpoint real para obtener razas por especie
      this.http.get<Raza[]>(`http://localhost:3000/raza?especieId=${especieId}`)
        .subscribe({
          next: (data) => {
            this.razas = data;
            razaControl?.enable();
            // Si no es la carga inicial, reseteamos el valor de la raza
            if (!esCargaInicial) {
              razaControl?.setValue(''); 
            }
          },
          error: (err) => {
            console.error('Error al cargar razas', err);
            this.razas = [];
            razaControl?.disable();
            razaControl?.setValue('');
          }
        });
    } else {
      this.razas = [];
      razaControl?.disable();
      razaControl?.setValue('');
    }
  }

  // Lógica de guardado actualizada para enviar JSON
  guardar(): void {
    if (this.animalForm.invalid) {
      console.log('El formulario no es válido. Por favor, revisa los campos.');
      this.animalForm.markAllAsTouched();
      return;
    }

    const datosActualizados = this.animalForm.getRawValue();
    const animalId = datosActualizados.id;
    const url = `${this.apiUrl}/${animalId}`;

    this.http.put(url, datosActualizados).subscribe({
      next: (response) => {
        console.log('¡Animal actualizado con éxito!', response);
        alert('¡Cambios guardados con éxito!');
        this.router.navigate(['/admin/animales']);
      },
      error: (err) => {
        console.error('Error al actualizar el animal', err);
        alert('Hubo un error al guardar los cambios.');
      }
    });
  }

  eliminar(): void {
    const animalId = this.animalForm.get('id')?.value;
    if (!animalId) return;

    // Usamos window.confirm para una confirmación simple y nativa del navegador
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${this.animalForm.get('nombre')?.value}? Esta acción no se puede deshacer.`
    );

    if (confirmacion) {
      const url = `${this.apiUrl}/${animalId}`;
      this.http.delete(url).subscribe({
        next: () => {
          console.log('Animal eliminado con éxito.');
          alert('El perfil del animal ha sido eliminado.');
          this.router.navigate(['/admin/animales']); // Redirigir a la lista principal
        },
        error: (err) => {
          console.error('Error al eliminar el animal', err);
          alert('Hubo un error al intentar eliminar el animal.');
        }
      });
    }
  }
}