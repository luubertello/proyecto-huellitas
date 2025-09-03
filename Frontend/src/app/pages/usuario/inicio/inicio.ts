import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  encapsulation: ViewEncapsulation.None
})
export class Inicio {
  constructor(private router: Router) {}

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
