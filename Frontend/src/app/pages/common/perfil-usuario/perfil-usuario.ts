// En: src/app/vistas/mi-perfil/mi-perfil.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, tap } from 'rxjs'; 

interface UsuarioPerfil {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  sexo: string;
  fechaNacimiento: Date;
  rol: { id: number, nombre: string };
}

interface SolicitudPerfil {
  id: number;
  animal: { nombre: string }; 
  estadoActual: { nombre: string };
  fechaSolicitud: string;
}

interface Donacion {
  id: number;
  monto: number;
  fecha: string;
  esAnonimo: boolean;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule 
  ],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {

  pestanaActual: string = 'datos';

  // --- URLs de APIs ---
  private usuariosApiUrl = 'http://localhost:3000/usuarios';
  private adopcionApiUrl = 'http://localhost:3000/solicitudes';

  // --- Propiedades de Estado ---
  usuario: UsuarioPerfil | null = null;
  solicitudes: SolicitudPerfil[] = [];
  donaciones: Donacion[] = []; 

  // --- Banderas de Carga ---
  isLoadingDatos = true;
  isLoadingSolicitudes = true;
  isSaving = false; 
  
  // --- Inyecciones ---
  private router = inject(Router);
  private authService = inject(AuthService);
  private http = inject(HttpClient); 

  constructor() { }

  ngOnInit(): void {
    this.seleccionarPestana('datos');
  }

  seleccionarPestana(pestana: string): void {
    this.pestanaActual = pestana;

    // --- Lógica de Carga ---

    if (pestana === 'datos' && !this.usuario) {
      this.cargarDatosPersonales();
    } 
    else if (pestana === 'solicitudes' && this.solicitudes.length === 0) {
      this.cargarMisSolicitudes();
    } 
    else if (pestana === 'donaciones' && this.donaciones.length === 0) {
      // this.cargarMisDonaciones();
      console.log('Cargando donaciones (simulado)...');
    }
  }

  // --- Pestana 1: Cargar Datos ---
  cargarDatosPersonales(): void {
    this.isLoadingDatos = true;
    this.http.get<UsuarioPerfil>(`${this.usuariosApiUrl}/perfil/me`).pipe(
      catchError(err => {
        console.error("Error al cargar datos del perfil", err);
        alert("Error: No se pudieron cargar tus datos. Intenta recargar la página.");
        return EMPTY;
      })
    ).subscribe(data => {
      this.usuario = data;
      this.isLoadingDatos = false;
    });
  }
  
  // --- Pestana 1: Guardar Datos ---
  guardarDatosPersonales(): void {
    if (!this.usuario || this.isSaving) return;

    this.isSaving = true;
    const dto = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      dni: this.usuario.dni,
      telefono: this.usuario.telefono,
      direccion: this.usuario.direccion,
      sexo: this.usuario.sexo,
      fechaNacimiento: this.usuario.fechaNacimiento
    };

    this.http.patch<UsuarioPerfil>(`${this.usuariosApiUrl}/perfil/me`, dto).pipe(
      catchError(err => {
        console.error("Error al guardar datos", err);
        alert("Error: No se pudieron guardar los cambios. Revisa los campos.");
        this.isSaving = false;
        return EMPTY;
      })
    ).subscribe(usuarioActualizado => {
      this.usuario = usuarioActualizado;
      this.isSaving = false;
      alert('¡Datos guardados con éxito!');
    });
  }

  // --- Pestana 2: Cargar Solicitudes ---
  cargarMisSolicitudes(): void {
    this.isLoadingSolicitudes = true;
    this.http.get<SolicitudPerfil[]>(`${this.adopcionApiUrl}/mis-solicitudes`).pipe(
      catchError(err => {
        console.error("Error al cargar solicitudes", err);
        alert("No se pudieron cargar tus solicitudes.");
        this.isLoadingSolicitudes = false;
        return EMPTY;
      })
    ).subscribe(data => {
      this.solicitudes = data;
      this.isLoadingSolicitudes = false;
    });
  }

  // --- Lógica de Navegación y Logout ---
  verDetalleSolicitud(id: number): void {
    this.router.navigate(['/solicitudes', id]); 
  }

  logout(): void {
    this.authService.logout();
  }
}