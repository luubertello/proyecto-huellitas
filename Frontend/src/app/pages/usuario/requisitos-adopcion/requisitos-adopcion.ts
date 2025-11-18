
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-requisitos-adopcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requisitos-adopcion.html',
  styleUrl: './requisitos-adopcion.css'
})
export class RequisitosAdopcion implements OnInit {

  private animalId: string | null = null; 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.animalId = this.route.snapshot.paramMap.get('id');
    if (!this.animalId) {
      console.error("¡ERROR! No se encontró el ID del animal en la URL.");
    }
  }

  irAlFormulario(): void {
    if (this.animalId) {
      this.router.navigate(['/formulario-adopcion', this.animalId]);
    } else {
      console.error("No se puede ir al formulario, no hay ID de animal.");
    }
  }

  volverAlPerfil(): void {
    if (this.animalId) {
      this.router.navigate(['/adopta/animal', this.animalId]);
    } else {
      this.router.navigate(['/adopta']);
    }
  }
}