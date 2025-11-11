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
  
  registrarSolicitudAdopcion(animal:any):void {
   this.router.navigate(['/adopta', 'animal', animal.id, 'formulario']);
  }

}
