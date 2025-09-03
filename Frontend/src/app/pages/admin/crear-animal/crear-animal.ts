import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-crear-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-animal.html',
  styleUrls: ['./crear-animal.css']
})
export class CrearAnimal implements OnInit {
  registrarAnimalForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMsg: string | null = null;

  ngOnInit(): void {
    this.registrarAnimalForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      especie: new FormControl('', [Validators.required]),
      raza: new FormControl('', [Validators.required]),
      edad: new FormControl('', [Validators.required, Validators.min(0)]),
      sexo: new FormControl('', [Validators.required,Validators.pattern('^(Macho|Hembra)$')]),
      descripcion: new FormControl(''),
      imagen: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrarAnimalForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Datos del animal:', this.registrarAnimalForm.value);
    // Aquí iría el POST al backend con HttpClient
    this.loading = false;
    
  }
}
