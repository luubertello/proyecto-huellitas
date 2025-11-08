import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Solicitud {
  id: number;
  estadoActual: {
    id: number;
    nombre: string;
  };
  animal: {
    id: number;
    nombre: string;
  };
  adoptante: {
    id: number;
    nombre: string;
  };
}
@Component({
  selector: 'app-gestion-adopcion',
  standalone: true,                // ✅
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-adopcion.html',
  styleUrls: ['./gestion-adopcion.css'],
})
export class GestionAdopcion implements OnInit {

  private apiUrl = 'http://localhost:3000/solicitudes'; 

  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  estados: string[] = ['Pendiente', 'Aprobada', 'Rechazada', 'Finalizada'];
  estadoSeleccionado: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.http.get<Solicitud[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = data;
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes', err);
      }
    });
  }

  filtrarSolicitudes() {
    if (this.estadoSeleccionado === '') {
      this.solicitudesFiltradas = this.solicitudes;
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(
        s => s.estadoActual.nombre === this.estadoSeleccionado
      );
    }
  }

  verSolicitud(solicitud: Solicitud) {
    this.router.navigate(['/admin/solicitudes', solicitud.id]);
  }

  rechazarSolicitud(solicitud: Solicitud) {
    const url = `${this.apiUrl}/${solicitud.id}`;
    
    // Asumo que tu endpoint PATCH espera un DTO simple como { estado: "Rechazada" }
    // Si espera un ID, deberías cambiarlo (ej: { estadoId: 4 })
    this.http.patch<Solicitud>(url, { estado: 'Rechazada' }).subscribe({
      next: (solicitudActualizada) => {

        solicitud.estadoActual = solicitudActualizada.estadoActual;
        
        this.filtrarSolicitudes();
      },
      error: (err) => {
        console.error('Error al rechazar la solicitud', err);
      }
    });
  }
}

