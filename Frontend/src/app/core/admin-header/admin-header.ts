// Archivo: admin-header.ts

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css' 
})
export class AdminHeader {

  private router = inject(Router);
  private authService = inject(AuthService);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // --- Métodos del menú de usuario ---

  logout(): void {
    this.authService.logout();
  }

  goPerfil(): void {
    this.router.navigate(['/mi-perfil']); 
  }

  // --- Métodos de navegación del Admin ---

  goInicioAdmin(): void {
    this.router.navigate(['/admin/inicio']); 
  }

  goAnimales(): void {
    this.router.navigate(['/admin/animales']);
  }

  goRegistrarAnimal(): void {
    this.router.navigate(['/admin/animales/nuevo']);
  }

  goSolicitudes(): void {
    this.router.navigate(['/admin/solicitudes']);
  }

  goInventarioStock(): void {
    this.router.navigate(['/admin/inventario']);
  }

  goRegistrarInsumo(): void {
    this.router.navigate(['/admin/inventario/nuevo']);
  }

  goEstadisticasDonaciones(): void {
    this.router.navigate(['/admin/estadisticas/donaciones']);
  }

  goEstadisticasAnimales(): void {
    this.router.navigate(['/admin/estadisticas/animales']);
  }

  goEstadisticasInsumos(): void {
    this.router.navigate(['/admin/estadisticas/insumos']);
  }
}