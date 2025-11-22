import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, EMPTY, firstValueFrom, Subject, of } from 'rxjs';

interface Categoria {
  id: number;
  nombre: string;
}

interface Insumo {
  id: number;
  nombre: string;
  stock: number;
  unidadMedida: string;
  categoria: Categoria; 
  atributos: any; 
}

@Component({
  selector: 'app-gestion-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-inventario.html',
  styleUrl: './gestion-inventario.css'
})
export class GestionInventario implements OnInit {
  // Arrays de datos
  inventarioOriginal: Insumo[] = [];
  inventarioFiltrado: Insumo[] = [];
  categorias: Categoria[] = [];

  // Variables de estado
  isLoading = true;
  errorMessage: string | null = null;
  filtroCategoria: number | null = null;
  
  // Para la barra de búsqueda
  private searchSubject = new Subject<string>();
  private apiUrl = 'http://localhost:3000/inventario';
  private apiCategoriasUrl = 'http://localhost:3000/inventario/categorias';

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadData();
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      this.search(query);
    });
  }

  // Carga inicial de datos
  loadData(): void {
    this.isLoading = true;
    
    Promise.all([
      firstValueFrom(this.http.get<Insumo[]>(this.apiUrl)),
      firstValueFrom(this.http.get<Categoria[]>(`${this.apiUrl}/categorias`))
    ]).then(([inventarioData, categoriasData]) => {
      this.inventarioOriginal = inventarioData;
      this.inventarioFiltrado = inventarioData;
      this.categorias = categoriasData;
      this.isLoading = false;
    }).catch(err => {
      this.errorMessage = 'Error al cargar los datos iniciales.';
      this.isLoading = false;
      console.error(err);
    });
  }

  // --- LÓGICA DE FILTRADO Y BÚSQUEDA ---

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    
    if (query === '') {
      this.applyFilter();
    } else {
      this.searchSubject.next(query);
    }
  }

  search(termino: string): void {
    this.isLoading = true;
    this.http.get<Insumo[]>(`${this.apiUrl}/buscar?q=${termino}`).pipe(
      catchError(() => of([])) 
    ).subscribe(data => {
      this.inventarioFiltrado = data;
      this.isLoading = false;
      this.filtroCategoria = null; 
    });
  }

  applyFilter(): void {
    if (!this.filtroCategoria) {
      this.inventarioFiltrado = this.inventarioOriginal;
      return;
    }
    
    this.inventarioFiltrado = this.inventarioOriginal.filter(item => 
      item.categoria.id === this.filtroCategoria
    );
  }


  // --- LÓGICA DE AJUSTE DE STOCK ---

  ajustarStock(insumoId: number, cantidad: number): void {
    if (!confirm(`¿Estás seguro de ajustar el stock en ${cantidad}?`)) return;

    this.http.patch<Insumo>(`${this.apiUrl}/${insumoId}/stock`, { cantidad }).pipe(
      catchError(err => {
        alert('Error al ajustar stock: ' + (err.error?.message || err.message));
        return EMPTY;
      })
    ).subscribe(() => {
      this.loadData(); 
    });
  }

  goNuevoInsumo(): void {
    this.router.navigate(['/admin/inventario/nuevo']);
  }
}
