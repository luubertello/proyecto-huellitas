import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importamos RouterLink
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-solicitar-recuperacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
  ],
  templateUrl: './solicitar-recuperacion.html',
  styleUrl: './solicitar-recuperacion.css'
})
export class SolicitarRecuperacion {

  solicitarForm: FormGroup;
  private apiUrl = 'http://localhost:3000/auth/solicitar-recuperacion';
  
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.solicitarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.solicitarForm.controls; }

  onSubmit(): void {
    if (this.solicitarForm.invalid) {
      this.solicitarForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const dto = {
      email: this.f['email'].value
    };

    this.http.post(this.apiUrl, dto).pipe(
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = 'Hubo un error en el servidor. Intenta más tarde.';
        return EMPTY; 
      })
    ).subscribe(response => {

      this.isLoading = false;
      this.successMessage = '¡Listo! Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.';
      this.solicitarForm.disable(); 
    });
  }

  goLogin(): void {
    this.router.navigate(['/iniciar-sesion']);
  }
}

