import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-requisitos-adopcion',
  imports: [],
  templateUrl: './requisitos-adopcion.html',
  styleUrl: './requisitos-adopcion.css',
  encapsulation: ViewEncapsulation.None,
})
export class RequisitosAdopcion {
  constructor(private router: Router) {}
  goFormulario(){
    this.router.navigate(['/adopta/formulario']);
  }

}
