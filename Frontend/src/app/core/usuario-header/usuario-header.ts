import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-header',
  imports: [],
  templateUrl: './usuario-header.html',
  styleUrl: './usuario-header.css'
})
export class UsuarioHeader {
  constructor(private router: Router) {}

  goInicio(): void {
    this.router.navigate(['/inicio']);   // 🔸 redirige al inicio
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
