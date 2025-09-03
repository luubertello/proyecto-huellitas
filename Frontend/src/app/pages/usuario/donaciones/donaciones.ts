import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-donaciones',
  templateUrl: './donaciones.html',
  styleUrl: './donaciones.css',
  encapsulation: ViewEncapsulation.None
})
export class Donaciones {
  constructor(private router: Router) {}

  goDonarInsumos() {
    this.router.navigate(['/dona-insumos'])
  }

  goDonarDinero() {
    this.router.navigate(['/dona-dinero'])
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

