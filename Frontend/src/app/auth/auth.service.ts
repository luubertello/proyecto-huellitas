// Archivo: auth.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, map } from 'rxjs';

interface LoginResponse {
  message: string;
  access_token: string;
}

// Interfaz para los datos del formulario
interface LoginCredentials {
  email: string;
  contrasena: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';
  private authTokenKey = 'authToken'; 

  // Inyección de dependencias moderna (Angular 14+)
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() { }

  /**
   * Llama al endpoint de login y guarda el token si tiene éxito.
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si la respuesta es exitosa, guardamos el token
        this.saveToken(response.access_token);
      })
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authTokenKey);
    }
    // Redirige al login o al inicio
    this.router.navigate(['/iniciar-sesion']);
  }

  /**
   * Guarda el token en localStorage (solo en el navegador).
   */
  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.authTokenKey, token);
    }
  }

  /**
   * Obtiene el token desde localStorage.
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }

  /**
   * Comprueba si el usuario está autenticado.
   */
  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem(this.authTokenKey);
  }
}