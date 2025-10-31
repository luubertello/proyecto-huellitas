// Archivo: usuario-header.ts

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-usuario-header',
  standalone: true, 
  imports: [
    CommonModule 
  ],
  templateUrl: './usuario-header.html',
  styleUrl: './usuario-header.css'
})
export class UsuarioHeader {
  
  private router = inject(Router);
  private authService = inject(AuthService);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }


  goPerfil(): void {
    this.router.navigate(['/mi-perfil']);
  }


  goInicio(): void {
    this.router.navigate(['/inicio']); 
  }

  goAdopcionGatos() {
    this.router.navigate(['/adopta/gatos']);
  }

  goAdopcionPerros() {
    this.router.navigate(['/adopta/perros']);
  }

  goAdopcionFormulario() {
    this.router.navigate(['/adopta/formulario']);
  }

  goAdopcionRequisitos() {
    this.router.navigate(['/adopta/requisitos']);
  }

  goAdopcion() {
    this.router.navigate(['/adopta']);
  }

  goDonar() {
    this.router.navigate(['/donar']);
  }

  goRegistro() {
      this.router.navigate(['/registro']);
  }

  goInicioSesion() {
      this.router.navigate(['/iniciar-sesion']);
  }
}