// Archivo: inicio-sesion.ts

import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


interface LoginResponse {
  message: string;
  access_token: string;
}

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

  loginForm: FormGroup; 
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/auth'; 
  
  // Para SSR
  private platformId = inject(PLATFORM_ID); 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
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
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.access_token);
        }
        
        alert('¡Inicio de sesión exitoso!');
        this.router.navigate(['/inicio']); 

      } else if (response === null) {
      } else {
        this.isLoading = false;
        this.errorMessage = 'Respuesta inesperada del servidor.';
      }
    });
  }

  // --- Inicio sesion con Google (SSR-safe) ---
  loginWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `${this.apiUrl}/google`; 
    }
  }

  goRegistro() {
    this.router.navigate(['/registro']);
  }
  
}