import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [],
  templateUrl: './no-autorizado.html',
  styleUrl: './no-autorizado.css'
})
export class NoAutorizado {

  private router = inject(Router);

  goInicio(): void {
    this.router.navigate(['/inicio']);
  }

  goLogin(): void {
    this.router.navigate(['/iniciar-sesion']);
  }
}