import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, of } from 'rxjs';

interface Categoria {
  id: number;
  nombre: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number; 
  unidadMedida: string; 
  categoria: Categoria; 
  atributos?: any; 
}

@Component({
  selector: 'app-registrar-insumo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-insumo.html',
  styleUrl: './registrar-insumo.css'
})
export class RegistrarInsumo implements OnInit {

  insumoForm: FormGroup;
  categorias: any[] = []; 
  
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private apiUrl = 'http://localhost:3000/inventario/insumo';
  private apiCategoriasUrl = 'http://localhost:3000/inventario/categorias';
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.insumoForm = this.fb.group({
      // --- Campos Principales (Estáticos) ---
      nombre: ['', Validators.required],
      descripcion: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      unidadMedida: ['', Validators.required], // <-- Usado para el SELECT

      // --- Campos de Relación ---
      categoriaId: [null, Validators.required], 
      
      // --- Campos Dinámicos (Atributos) ---
      // Se usan para el formulario, pero se empaquetan en 'atributos: {}' al final
      marca: [{ value: '', disabled: true }],
      droga: [{ value: '', disabled: true }],
      especie: [{ value: 'Perro', disabled: true }],
      etapa: [{ value: 'Adulto', disabled: true }],
      tipoProducto: [{ value: '', disabled: true }], // Para Higiene/Accesorios
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.setupFormularioDinamico();
  }

  // --- LÓGICA DINÁMICA (Habilita/Deshabilita) ---
  private setupFormularioDinamico(): void {
    const camposDinamicos = ['marca', 'droga', 'especie', 'etapa', 'tipoProducto'];
    
    this.insumoForm.get('categoriaId')?.valueChanges.subscribe(id => {
      // 1. Deshabilitamos TODOS los campos dinámicos
      camposDinamicos.forEach(campo => this.insumoForm.get(campo)?.disable());

      const categoria = this.categorias.find(c => c.id === id)?.nombre;
      
      // 2. Habilitamos SÓLO los que necesitamos
      switch (categoria) {
        case 'Alimentos':
          this.insumoForm.get('marca')?.enable();
          this.insumoForm.get('especie')?.enable();
          this.insumoForm.get('etapa')?.enable();
          break;
        case 'Medicamentos':
          this.insumoForm.get('marca')?.enable();
          this.insumoForm.get('droga')?.enable();
          break;
        case 'Higiene':
        case 'Accesorios':
          this.insumoForm.get('tipoProducto')?.enable();
          break;
      }
    });
  }

  // --- LÓGICA DE CARGA (Usada por ngOnInit) ---
  loadCategorias(): void {
    this.http.get<any[]>(this.apiCategoriasUrl)
      .pipe(catchError(err => {
        console.error('Error al cargar categorías', err);
        this.errorMessage = 'No se pudo cargar el catálogo de categorías.';
        return of([]); 
      }))
      .subscribe(data => {
        this.categorias = data;
        if (data.length > 0 && !this.insumoForm.get('categoriaId')?.value) {
          this.insumoForm.get('categoriaId')?.setValue(data[0].id);
        }
      });
  }
  
  get f() { return this.insumoForm.controls; }

  // --- Envío al Backend (¡Empaquetamos el JSONB!) ---
  onSubmit(): void {
    if (this.insumoForm.invalid) {
      this.insumoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.insumoForm.getRawValue(); // Incluye campos deshabilitados
    
    // 1. Empaquetamos los atributos dinámicos
    const atributosDinamicos: any = {};
    if (formValue.especie) atributosDinamicos.especie = formValue.especie;
    if (formValue.etapa) atributosDinamicos.etapa = formValue.etapa;
    if (formValue.marca) atributosDinamicos.marca = formValue.marca;
    if (formValue.droga) atributosDinamicos.droga = formValue.droga;
    if (formValue.tipoProducto) atributosDinamicos.tipoProducto = formValue.tipoProducto;

    // 2. Creamos el DTO final
    const dataToSend = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      stock: formValue.stock,
      unidadMedida: formValue.unidadMedida,
      categoriaId: formValue.categoriaId,
      
      // El "bolsillo" JSON que el backend espera
      atributos: atributosDinamicos, 
    };

    // 3. Llamada al API
    this.http.post(this.apiUrl, dataToSend).pipe(
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al crear el insumo. Verifique los datos.';
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.isLoading = false;
        this.successMessage = `¡Insumo creado con éxito!`;
        this.insumoForm.reset();
        this.insumoForm.get('categoriaId')?.setValue(null); 
        this.router.navigate(['/admin/inventario/stock']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/inventario/stock']);
  }
}