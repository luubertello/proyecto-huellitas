import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrl: './registro.css',
  encapsulation: ViewEncapsulation.None
})
export class Registro {
  constructor (private router: Router) {}

  goInicioSesion() {
      this.router.navigate(['/inicio-sesion']);
    }

  goAdopcionGatos() {
    this.router.navigate(['/adopcion/gatos']);
  }

  goAdopcionPerros() {
    this.router.navigate(['/adopcion/perros']);
  }

  goAdopcionFormulario() {
    this.router.navigate(['/adopcion/formulario']);
  }

  goAdopcionRequisitos() {
    this.router.navigate(['/adopcion/requisitos']);
  }

  goAdopcion() {
    this.router.navigate(['/adopcion']);
  }

  goDonar() {
    this.router.navigate(['/donaciones']);
  }

  goInicio() {
    this.router.navigate(['/inicio]']);
  }

}
