import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormControl } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface RegisterFormModel {
  email: FormControl<string | null>;
  contrasena: FormControl<string | null>;
  confirmarContrasena: FormControl<string | null>; 
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  dni: FormControl<string | null>;
  sexo: FormControl<string | null>;
  fechaNacimiento: FormControl<string | null>;
  direccion: FormControl<string | null>;
  telefono: FormControl<string | null>;
}

// --- (Componente) ---
@Component({
  selector: 'app-registro',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements OnInit {
  
  registerForm: FormGroup<RegisterFormModel>; 
  step = 1;
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {

    this.registerForm = this.fb.group({
      // Paso 1
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
      // Paso 2
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]], 
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      // Paso 3
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]] 
    }, {
      validators: this.passwordMatcher
    });
  }

  ngOnInit(): void {}

  // 3. CORRECCIÓN EN EL VALIDADOR
  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('contrasena')?.value; // <-- RENOMBRADO
    const confirm = control.get('confirmarContrasena')?.value; // <-- RENOMBRADO
    return pass === confirm ? null : { contrasenasNoCoinciden: true }; 
  }

  // --- Lógica de Pasos ---
  nextStep() {
    if (this.step === 1) {
      if (this.f.email.invalid || this.f.contrasena.invalid || this.f.confirmarContrasena.invalid || this.registerForm.hasError('contrasenasNoCoinciden')) {
        this.f.email.markAsTouched();
        this.f.contrasena.markAsTouched(); // <-- RENOMBRADO
        this.f.confirmarContrasena.markAsTouched(); // <-- RENOMBRADO
        return;
      }
      this.step = 2;
    } 
    else if (this.step === 2) {
      if (this.f.nombre.invalid || this.f.apellido.invalid || this.f.dni.invalid || this.f.sexo.invalid || this.f.fechaNacimiento.invalid) {
        this.f.nombre.markAsTouched();
        this.f.apellido.markAsTouched();
        this.f.dni.markAsTouched();
        this.f.sexo.markAsTouched();
        this.f.fechaNacimiento.markAsTouched();
        return;
      }
      this.step = 3;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  // --- Envío al Backend ---
  onSubmit() {
    if (this.f.direccion.invalid || this.f.telefono.invalid) {
      this.f.direccion.markAsTouched();
      this.f.telefono.markAsTouched();
      return;
    }
    
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { ...this.registerForm.value };
      delete formData.confirmarContrasena; // <-- RENOMBRADO

      this.http.post(`${this.apiUrl}/registro`, formData).pipe(
        catchError(err => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error al crear la cuenta. Intente más tarde.';
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.isLoading = false;
          alert('¡Cuenta creada con éxito! Serás redirigido al inicio de sesión.');
          this.goInicioSesion();
        }
      });
    }
  }

  // --- Navegación ---
  goInicioSesion() {
    this.router.navigate(['/iniciar-sesion']);
  }
  
  // --- Getters ---
  get f() {
    return this.registerForm.controls;
  }
}