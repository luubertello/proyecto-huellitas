import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioAdmin {

  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string | null = this.authService.getUserName();

  get isGeneral(): boolean {
    return this.authService.hasRole('admin general');
  }

  get canSeeAnimales(): boolean {
    return this.isGeneral || this.authService.hasRole('responsable de animales');
  }

  get canSeeAdopciones(): boolean {
    return this.isGeneral || this.authService.hasRole('responsable de adopciones');
  }

  get canSeeDonaciones(): boolean {
    return this.isGeneral || this.authService.hasRole('responsable de donaciones');
  }

  get canSeeInventario(): boolean {
    return this.isGeneral || this.authService.hasRole('responsable de inventario');
  }

  // --- Métodos de Navegación ---

  goAnimales() { this.router.navigate(['/admin/animales']); }
  goRegistrarAnimal() { this.router.navigate(['/admin/animales/registrar']); }
  goSolicitudes() { this.router.navigate(['/admin/solicitudes']); }
  goInventario() { this.router.navigate(['/admin/inventario']); }
  goDonaciones() { this.router.navigate(['/admin/estadisticas/donaciones']); }
}