import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // ✅ Necesario para *ngFor y *ngIf
import { FormsModule } from '@angular/forms';     // ✅ Necesario para [(ngModel)]

interface Solicitud {
  id: number;
  nombreAnimal: string;
  estado: string;
}

@Component({
  selector: 'app-gestion-adopcion',
  standalone: true,                // ✅
  imports: [CommonModule, FormsModule], // ✅
  templateUrl: './gestion-adopcion.html',
  styleUrls: ['./gestion-adopcion.css']
})
export class GestionAdopcion implements OnInit {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  estados: string[] = ['Pendiente', 'En Proceso', 'Aprobada', 'Rechazada'];
  estadoSeleccionado: string = '';

  ngOnInit(): void {
    this.solicitudes = [
      { id: 1, nombreAnimal: 'Michi', estado: 'Pendiente' },
      { id: 2, nombreAnimal: 'Luna', estado: 'En Proceso' },
      { id: 3, nombreAnimal: 'Firulais', estado: 'Pendiente' }
    ];
    this.solicitudesFiltradas = this.solicitudes;
  }

  filtrarSolicitudes() {
    if (this.estadoSeleccionado === '') {
      this.solicitudesFiltradas = this.solicitudes;
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(
        s => s.estado === this.estadoSeleccionado
      );
    }
  }

  verSolicitud(solicitud: Solicitud) {
    alert(`Ver detalles de ${solicitud.nombreAnimal}`);
  }

  rechazarSolicitud(solicitud: Solicitud) {
    if (confirm(`¿Rechazar solicitud de ${solicitud.nombreAnimal}?`)) {
      solicitud.estado = 'Rechazada';
      this.filtrarSolicitudes();
    }
  }
}
