import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importar Location
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';

// --- Interfaces basadas en tu JSON ---

interface Estado {
  id: number;
  nombre: string;
}

interface EspecieRaza {
  id: number;
  nombre: string;
}

interface Animal {
  id: number;
  nombre: string;
  sexo: string;
  fechaNacimiento: string;
  descripcion: string;
  foto: string;
  raza: EspecieRaza;
  especie: EspecieRaza;
  estadoActual: Estado | null;
}

interface Adoptante {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  sexo: string;
  fechaNacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
}

interface Formulario {
  id: number;
  motivoAdopcion: string;
  experienciaPrevia: string;
  tieneOtrosAnimales: boolean;
  cantidadPerros: number;
  cantidadGatos: number;
  otrasEspeciesDescripcion: string | null;
  tipoVivienda: string;
  tienePatio: boolean | null;
  tieneBalcon: boolean | null;
  balconConProteccion: boolean | null;
  medidasDeSeguridad: string;
  tiempoAnimalSoloHoras: number;
  compromisoPaseos: boolean;
  compromisoGastosVet: boolean;
}

// Esta es la interfaz principal que tu API devuelve
interface SolicitudCompleta {
  id: number;
  fechaSolicitud: string;
  adoptanteId: number;
  animalId: number;
  formulario: Formulario;
  estadoActual: Estado;
  animal: Animal;
  adoptante: Adoptante;
}

// --- Componente ---

@Component({
  selector: 'app-ver-solicitud',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ver-solicitud.html',
  styleUrls: ['./ver-solicitud.css']
})
export class VerSolicitud implements OnInit {

  private apiUrl = 'http://localhost:3000/solicitudes';

  solicitud: SolicitudCompleta | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  modalAnimal: Animal | null = null;
  modalAdoptante: Adoptante | null = null;
  modalTitle = '';  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location, 
    private router: Router
  ) {}

ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.isLoading = true;
        this.solicitud = null;
        this.errorMessage = null;
        
        this.cargarSolicitud(id);
      } else {
        this.errorMessage = "No se proporcionó un ID de solicitud.";
        this.isLoading = false;
      }
    });
  }

  cargarSolicitud(id: string): void {
    // Usamos el endpoint 'findOne' que enriquece los datos
    this.http.get<SolicitudCompleta>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error al cargar la solicitud:', err);
        this.errorMessage = `Error: No se pudo encontrar la solicitud #${id}. Es posible que la API no esté respondiendo.`;
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe(data => {
      this.solicitud = data;
      this.isLoading = false;
    });
  }

  // --- Lógica de Modales ---
  abrirModal(tipo: 'animal' | 'adoptante'): void {
      if (!this.solicitud) return;

      if (tipo === 'animal') {
        this.modalTitle = `Perfil Completo: ${this.solicitud.animal.nombre}`;
        this.modalAnimal = this.solicitud.animal;
      } else {
        this.modalTitle = `Perfil Completo: ${this.solicitud.adoptante.nombre} ${this.solicitud.adoptante.apellido}`;
        this.modalAdoptante = this.solicitud.adoptante;
      }
    }

    cerrarModal(): void {
      // Reseteamos ambas variables
      this.modalAnimal = null;
      this.modalAdoptante = null;
      this.modalTitle = '';
    }

  // --- Lógica de Acciones ---
  cambiarEstado(nuevoEstado: string): void {
    if (!this.solicitud || !confirm(`¿Estás seguro de que deseas "${nuevoEstado}" esta solicitud?`)) return;

    const id = this.solicitud.id;
    let nuevoEstadoId: number;

    switch (nuevoEstado.toLowerCase()) {
      case 'aprobar': 
        nuevoEstadoId = 2; 
        break; 
      case 'rechazar': 
        nuevoEstadoId = 3; 
        break; 
      case 'finalizar':
        nuevoEstadoId = 4;
        break;
      default: 
        return;
    }
    
    const dto = { nuevoEstadoId: nuevoEstadoId, motivo: `Estado cambiado a ${nuevoEstado} desde admin` };
    const url = `${this.apiUrl}/${id}/estado`; 

    this.http.patch<SolicitudCompleta>(url, dto).subscribe({
      next: (solicitudActualizada) => {
        this.solicitud!.estadoActual = solicitudActualizada.estadoActual;
        alert(`Solicitud actualizada a "${solicitudActualizada.estadoActual.nombre}" con éxito.`);
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        // El error 404 por la URL incorrecta debería desaparecer
        alert('Error al actualizar el estado: ' + err.message);
      }
    });
  }

  /*
  contactarAdoptante(): void {
    if (this.solicitud?.adoptante.email) {
      window.location.href = `mailto:${this.solicitud.adoptante.email}?subject=Sobre tu solicitud de adopción para ${this.solicitud.animal.nombre}`;
    } else {
      alert('Este adoptante no tiene un email registrado.');
    }
  }
*/
  // --- Navegación ---
  volverAtras(): void {
    this.router.navigate(['/admin/solicitudes']);
  }
}