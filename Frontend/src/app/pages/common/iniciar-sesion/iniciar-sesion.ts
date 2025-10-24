// Archivo: inicio-sesion.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface LoginFormModel {
  email: FormControl<string | null>;
  contrasena: FormControl<string | null>; 
}

interface LoginResponse {
  message: string;
  access_token: string;
}

// --- Componente ---
@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './iniciar-sesion.html', 
  styleUrls: ['./iniciar-sesion.css']
})
export class IniciarSesion implements OnInit {

  loginForm: FormGroup<LoginFormModel>;
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]] // SIN ñ
    });
  }

  ngOnInit(): void {}

  // --- Envío al Backend ---
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.loginForm.value;

    this.http.post<LoginResponse>(`${this.apiUrl}/login`, formData).pipe(
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Intente más tarde.';
        return of(null); 
      })
    ).subscribe(response => {
      if (response && response.access_token) {
        this.isLoading = false;
        
        localStorage.setItem('authToken', response.access_token);
        
        // 2. Opcional: Decodificar token para saber el rol y redirigir
        // const decodedToken = jwt_decode(response.access_token); // Necesitarías instalar jwt-decode
        // if (decodedToken.rol === 'admin') { this.router.navigate(['/admin/dashboard']); } else { ... }

        alert('¡Inicio de sesión exitoso!');
        this.router.navigate(['/inicio']); 

      } else if (response === null) {
      } else {
        this.isLoading = false;
        this.errorMessage = 'Respuesta inesperada del servidor.';
      }
    });
  }

  // Inicio sesion con Google
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`; 
  }

  // --- Navegación ---
  goRegistro() {
    this.router.navigate(['/registro']);
  }
  
  // --- Getters para facilitar el acceso en el HTML ---
  get f() {
    return this.loginForm.controls;
  }
}