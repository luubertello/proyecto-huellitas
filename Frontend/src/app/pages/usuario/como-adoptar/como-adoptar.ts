import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-como-adoptar',
  imports: [],
  templateUrl: './como-adoptar.html',
  styleUrl: './como-adoptar.css',
  encapsulation: ViewEncapsulation.None,
})
export class ComoAdoptar {
  constructor(private router: Router) {}
  goRequisitos(){
    this.router.navigate(['/adopta/requisitos']);
  }

  goAdopcionGatos() {
    this.router.navigate(['/adopta/gatos']);
  }

  goAdopcionPerros() {
    this.router.navigate(['/adopta/perros']);
  }

}
