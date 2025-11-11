
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { catchError, EMPTY } from 'rxjs';

// --- Validador Personalizado ---
export function contrasenasCoincidenValidator(control: AbstractControl): ValidationErrors | null {
  const nuevaContrasena = control.get('nuevaContrasena');
  const confirmarContrasena = control.get('confirmarContrasena');
  
  if (nuevaContrasena && confirmarContrasena && nuevaContrasena.value !== confirmarContrasena.value) {
    confirmarContrasena.setErrors({ noCoinciden: true });
    return { noCoinciden: true };
  } else {
    if (confirmarContrasena) {
      confirmarContrasena.setErrors(null);
    }
    return null;
  }
}


@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './restablecer-contrasena.html',
  styleUrl: './restablecer-contrasena.css'
})
export class RestablecerContrasena implements OnInit {

  resetForm: FormGroup;
  private token: string | null = null;
  private apiUrl = 'http://localhost:3000/auth/restablecer-contrasena';

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.resetForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]]
    }, {
      validators: contrasenasCoincidenValidator 
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMessage = 'Enlace inválido o faltante. Por favor, solicita un nuevo correo de recuperación.';
      this.resetForm.disable();
    }
  }

  get f() { return this.resetForm.controls; }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const dto = {
      token: this.token,
      nuevaContrasena: this.f['nuevaContrasena'].value
    };

    this.http.post(this.apiUrl, dto).pipe(
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'El enlace ha expirado o es inválido. Por favor, solicita uno nuevo.';
        return EMPTY; 
      })
    ).subscribe(response => {
      this.isLoading = false;
      this.successMessage = '¡Contraseña actualizada con éxito! Serás redirigido al inicio de sesión...';
      this.resetForm.disable();

      setTimeout(() => {
        this.router.navigate(['/iniciar-sesion']);
      }, 3000);
    });
  }
}