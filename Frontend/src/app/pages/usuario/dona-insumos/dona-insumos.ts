import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../../auth/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dona-insumos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dona-insumos.html',
  styleUrls: ['./dona-insumos.css']
})
export class DonaInsumos implements OnInit {

  donacionForm: FormGroup;
  isLoggedIn = false;
  
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private apiUrl = 'http://localhost:3000/donaciones/insumos'; 

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.donacionForm = this.fb.group({
      // --- Campos de Invitado ---
      nombreInvitado: [''],
      emailInvitado: ['', [Validators.email]],
      telefonoInvitado: [''],

      // --- Campos Principales de Insumo ---
      categoria: ['Alimentos', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]], 
      cantidad: [1, [Validators.required, Validators.min(1)]],
      unidad: ['Unidades', [Validators.required]],

      // --- Campos Dinámicos (Atributos) ---
      especie: [{ value: 'Perro', disabled: true }], 
      etapa: [{ value: 'Adulto', disabled: true }],
      marca: [{ value: '', disabled: true }],
      droga: [{ value: '', disabled: true }],
      tipoProducto: [{ value: '', disabled: true }], 

      // --- Campos de Logística ---
      tipoEntrega: ['fundacion', [Validators.required]],
      direccionRetiro: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.actualizarValidadoresLogin();
    this.setupFormularioDinamico();
  }

  private actualizarValidadoresLogin(): void {
    const nombreControl = this.donacionForm.get('nombreInvitado');
    const emailControl = this.donacionForm.get('emailInvitado');
    const telefonoControl = this.donacionForm.get('telefonoInvitado');

    if (this.isLoggedIn) {
      nombreControl?.clearValidators();
      emailControl?.clearValidators();
      emailControl?.setValidators([Validators.email]);
      telefonoControl?.clearValidators();
    } else {
      nombreControl?.setValidators([Validators.required]);
      emailControl?.setValidators([Validators.required, Validators.email]);
      telefonoControl?.setValidators([Validators.required]);
    }
    nombreControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
    telefonoControl?.updateValueAndValidity();
  }

  private setupFormularioDinamico(): void {
    const categoriaControl = this.donacionForm.get('categoria');
    const tipoEntregaControl = this.donacionForm.get('tipoEntrega');
    
    const camposDinamicos = ['especie', 'etapa', 'marca', 'droga', 'tipoProducto'];

    categoriaControl?.valueChanges.subscribe(value => {
      camposDinamicos.forEach(campo => this.donacionForm.get(campo)?.disable());

      switch (value) {
        case 'Alimentos':
          this.donacionForm.get('especie')?.enable();
          this.donacionForm.get('etapa')?.enable();
          break;
        case 'Medicamentos':
          this.donacionForm.get('marca')?.enable();
          this.donacionForm.get('droga')?.enable();
          break;
        case 'Higiene':
          this.donacionForm.get('tipoProducto')?.enable();
          break;
        case 'Accesorios':
          this.donacionForm.get('tipoProducto')?.enable();
          break;
      }
    });

    tipoEntregaControl?.valueChanges.subscribe(value => {
      const direccionControl = this.donacionForm.get('direccionRetiro');
      if (value === 'retira_domicilio') {
        direccionControl?.setValidators([Validators.required]);
        direccionControl?.enable();
      } else {
        direccionControl?.clearValidators();
        direccionControl?.disable();
      }
      direccionControl?.updateValueAndValidity();
    });

    categoriaControl?.updateValueAndValidity();
    tipoEntregaControl?.updateValueAndValidity();
    this.donacionForm.get('especie')?.enable(); 
    this.donacionForm.get('etapa')?.enable();   
 }

  get f() { return this.donacionForm.controls; }

  onSubmit(): void {
    if (this.donacionForm.invalid) {
      this.donacionForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.donacionForm.getRawValue();

    const atributosDinamicos: any = {};
    switch (formValue.categoria) {
      case 'Alimentos':
        atributosDinamicos.especie = formValue.especie;
        atributosDinamicos.etapa = formValue.etapa;
        break;
      case 'Medicamentos':
        atributosDinamicos.marca = formValue.marca;
        atributosDinamicos.droga = formValue.droga;
        break;
      case 'Higiene':
      case 'Accesorios':
        atributosDinamicos.tipoProducto = formValue.tipoProducto;
        break;
    }

    const dtoParaBackend = {
      nombreInvitado: formValue.nombreInvitado,
      emailInvitado: formValue.emailInvitado,
      telefonoInvitado: formValue.telefonoInvitado,
      
      categoria: formValue.categoria,
      descripcion: formValue.descripcion,
      cantidad: formValue.cantidad,
      unidad: formValue.unidad, 
      
      tipoEntrega: formValue.tipoEntrega,
      direccionRetiro: formValue.direccionRetiro,
      atributos: atributosDinamicos,
    };

    this.http.post(this.apiUrl, dtoParaBackend).pipe(
      catchError(err => {
        this.isLoading = false;
        
        if (err.error && Array.isArray(err.error.message)) {
          const primerError = err.error.message[0];
          if (primerError.constraints) {
            this.errorMessage = Object.values(primerError.constraints)[0] as string;
          } else {
            this.errorMessage = 'El formulario tiene errores. Revisa los campos.';
          }
        } else {
          this.errorMessage = err.error?.message || 'Error al enviar la donación. Intenta más tarde.';
        }
        return EMPTY;
      })
    ).subscribe(response => {
      this.isLoading = false;
      this.successMessage = '¡Donación registrada con éxito! En breve recibirás un correo de confirmación y nos pondremos en contacto.';
      this.donacionForm.disable();
    });
  }

  goInicio(): void {
    this.router.navigate(['/inicio']);
  }
}