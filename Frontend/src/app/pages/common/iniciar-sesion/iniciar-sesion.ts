// Archivo: inicio-sesion.ts

import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';


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
  
  // Para SSR
  private platformId = inject(PLATFORM_ID); 
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
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

    this.authService.login(this.loginForm.value).pipe(
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Intente más tarde.';
        return of(null);
      })
    ).subscribe(response => {
      this.isLoading = false;
      
      if (response) {
        alert('¡Inicio de sesión exitoso!');
        const adminRoles = [
          'admin general',
          'responsable de adopciones',
          'responsable de animales',
          'responsable de donaciones',
          'responsable de inventarios'
        ];

        const esAdmin = adminRoles.some(role => this.authService.hasRole(role));

        if (esAdmin) {
          this.router.navigate(['/admin/inicio']);
        } else {
          this.router.navigate(['/inicio']); 
        }
        
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