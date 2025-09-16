import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Opcion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-crear-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-animal.html',
  styleUrls: ['./crear-animal.css'],
  encapsulation: ViewEncapsulation.None
})
export class CrearAnimal implements OnInit {
  registrarAnimalForm!: FormGroup;
  loading = false;

  sexos: Opcion[] = [];
  especies: Opcion[] = [];
  razas: Opcion[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.registrarAnimalForm = this.fb.group({
      nombre: ['', Validators.required],
      razaId: [null, Validators.required],
      sexoId: [null, Validators.required],
      especieId: [null, Validators.required],
      fechaNacimiento: [null],
      descripcion: [''],
      foto: [null, Validators.required]
    });

    this.cargarOpciones();
  }

  cargarOpciones() {
    // Trae sexos
    this.http.get<Opcion[]>('http://localhost:3000/sexo')
      .subscribe(data => this.sexos = data);

    // Trae especies
    this.http.get<Opcion[]>('http://localhost:3000/especie')
      .subscribe(data => this.especies = data);

    // Trae razas
    this.http.get<Opcion[]>('http://localhost:3000/raza')
      .subscribe(data => this.razas = data);
  }

  onSubmit() {
    if (this.registrarAnimalForm.invalid) return;

    this.loading = true;

    const formData = this.registrarAnimalForm.value;

    // Si tenés foto como archivo, podés usar FormData. Si es solo URL, lo dejás así
    const payload = {
      nombre: formData.nombre,
      razaId: formData.razaId,
      sexoId: formData.sexoId,
      especieId: formData.especieId,
      fechaNacimiento: formData.fechaNacimiento,
      descripcion: formData.descripcion,
      foto: formData.foto // si subís archivo, cambiar a FormData
    };

    this.http.post('http://localhost:3000/animales', payload)
      .subscribe({
        next: (res) => {
          alert('Animal registrado con éxito!');
          this.registrarAnimalForm.reset();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          alert('Error al registrar el animal');
          this.loading = false;
        }
      });
  }
}