// Archivo: auth.service.ts

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 

// --- Interfaces ---
interface LoginResponse {
  message: string;
  access_token: string;
}

interface LoginCredentials {
  email: string;
  contrasena: string;
}

interface JwtPayload {
  sub: number; 
  email: string;
  nombre: string; 
  rol: { nombre: string } | { nombre: string }[]; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';
  private authTokenKey = 'authToken';

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // --- Métodos de Login/Logout ---

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.access_token);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authTokenKey);
    }
    this.router.navigate(['/iniciar-sesion']);
  }

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.authTokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem(this.authTokenKey);
  }

  private getDecodedToken(): JwtPayload | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        this.logout(); 
        return null;
      }
    }
    return null;
  }

  getUserName(): string | null {
    const payload = this.getDecodedToken();
    return payload ? payload.nombre : null;
  }


  getUserRoles(): string[] {
    const payload = this.getDecodedToken();
    if (!payload || !payload.rol) {
      return [];
    }

    const roles = Array.isArray(payload.rol)
      ? payload.rol.map(r => r.nombre.toLowerCase())
      : [payload.rol.nombre.toLowerCase()];
      
    return roles;
  }

  hasRole(roleName: string): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes(roleName.toLowerCase());
  }
}