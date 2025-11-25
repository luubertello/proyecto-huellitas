// crear-animal.component.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-crear-animal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule], 
  templateUrl: './crear-animal.html',
  styleUrls: ['./crear-animal.css'],
  encapsulation: ViewEncapsulation.None,
  host: { 'ngSkipHydration': 'true' }
})
export class CrearAnimal implements OnInit {

  registrarAnimalForm: FormGroup;
  especies: any[] = [];
  razas: any[] = [];
  public registroExitoso = false; 
  public hasPermission: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrarAnimalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: [null, Validators.required],
      raza: [{ value: null, disabled: true }, Validators.required],
      sexo: [null, Validators.required],
      fechaNacimiento: [''],
      descripcion: [''],
      foto: ['', Validators.required],
    });
  }

  ngOnInit() {
    const requiredRoles = ['Admin General', 'Responsable de Animales'];
    this.hasPermission = requiredRoles.some(role => this.authService.hasRole(role));

    if (!this.hasPermission) {
      console.warn('ACCESO DENEGADO: Usuario no es responsable de animales.');
      this.router.navigate(['/admin/dashboard']); // Redirigimos si no tiene permiso
      return; 
    }
    this.loadEspecies();
  }

  loadEspecies() {
    this.http.get<any[]>('http://localhost:3000/especie')
      .subscribe({
        next: (data) => this.especies = data,
        error: (err) => console.error('Error cargando especies', err)
      });
  }

  onEspecieChange() {
    const especieId = this.registrarAnimalForm.get('especie')?.value;
    const razaControl = this.registrarAnimalForm.get('raza');
    if (especieId) {
      this.http.get<any[]>(`http://localhost:3000/raza?especieId=${especieId}`)
        .subscribe({
          next: (data) => {
            this.razas = data;
            razaControl?.enable();
            razaControl?.setValue('');
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
      razaControl?.setValue('');
      razaControl?.disable();
    }
  }

  onSubmit() {
    if (!this.registrarAnimalForm.valid) {
      console.warn('Formulario inválido');
      this.registrarAnimalForm.markAllAsTouched();
      return;
    }

    const dto = {
      nombre: this.registrarAnimalForm.value.nombre,
      especieId: this.registrarAnimalForm.value.especie,
      razaId: this.registrarAnimalForm.value.raza,
      sexo: this.registrarAnimalForm.value.sexo,
      descripcion: this.registrarAnimalForm.value.descripcion,
      foto: this.registrarAnimalForm.value.foto,
      estadoActualId: 1, 
      fechaNacimiento: this.registrarAnimalForm.value.fechaNacimiento || null
    };

    this.http.post('http://localhost:3000/animales', dto)
      .subscribe({
        next: res => {
          console.log('Animal registrado:', res);
          this.registroExitoso = true;
        },
        error: err => {
          console.error('Error al registrar animal', err);
          alert('Hubo un error al registrar el animal.');
        }
      });
  }

  registrarOtro(): void {
    this.registroExitoso = false;
    this.registrarAnimalForm.reset();
    this.registrarAnimalForm.get('raza')?.disable();
  }

  volverAGestionar(): void {
    this.router.navigate(['/admin/animales']); 
  }
}