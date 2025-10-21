import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

// Definición de la interfaz para el perfil de usuario
export interface PerfilUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string; // Usaremos string para el formato 'yyyy-MM-dd'
  telefono: string;
  foto: string;
}

// Validador personalizado para verificar que las contraseñas nueva y de confirmación coincidan
// y que si una se llena, la otra también sea requerida.
export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const passwordNueva = control.get('passwordNueva');
  const passwordConfirm = control.get('passwordConfirm');

  // Si no existen los controles, o el formulario no tiene ambos, retorna null
  if (!passwordNueva || !passwordConfirm) {
    return null;
  }

  const nuevaValue = passwordNueva.value;
  const confirmValue = passwordConfirm.value;
  
  // Si la nueva o la confirmación tienen valor, ambas deben tener valor
  const isPasswordChangeAttempt = nuevaValue || confirmValue;

  if (isPasswordChangeAttempt) {
    // Si intentamos cambiar la contraseña, ambas son requeridas
    if (!nuevaValue) {
      passwordNueva.setErrors({ requiredIfChange: true });
    } else if (passwordNueva.hasError('requiredIfChange')) {
      passwordNueva.setErrors(null);
      passwordNueva.updateValueAndValidity(); // Asegurarse de que el cambio se propague
    }

    if (!confirmValue) {
      passwordConfirm.setErrors({ requiredIfChange: true });
    } else if (passwordConfirm.hasError('requiredIfChange')) {
      passwordConfirm.setErrors(null);
      passwordConfirm.updateValueAndValidity(); // Asegurarse de que el cambio se propague
    }
    
    // Si tienen valor, verificamos si coinciden
    if (nuevaValue && confirmValue && nuevaValue !== confirmValue) {
      // Establece un error en el control del formulario (FormGroup)
      return { passwordsDoNotMatch: true }; 
    }
  }

  // Si no se intenta cambiar la contraseña, o si coinciden, no hay error
  return null;
};


@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-usuario.html', // Asumiendo que el nombre de tu archivo HTML es 'perfil-usuario.html'
   styleUrl: './perfil-usuario.css',
  encapsulation: ViewEncapsulation.None,
})
export class PerfilUsuario implements OnInit {
  public perfil?: PerfilUsuario;
  // URL de la API (ajusta según tu backend)
  private apiUrl = 'http://localhost:3000/usuario'; 
  // ID del usuario que debería obtenerse del servicio de autenticación
  // Se simula con un valor fijo por ahora.
  private userId: number = 1; 

  public perfilForm: FormGroup;
  public fotoPreview: string | ArrayBuffer | null = null;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicialización del FormGroup con los campos y validadores
    this.perfilForm = new FormGroup({
      id: new FormControl(null),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')]),
      foto: new FormControl(''),
      
      // Controles para el cambio de contraseña (Opcionales a menos que se llenen)
      passwordActual: new FormControl(''),
      passwordNueva: new FormControl('', [Validators.minLength(6)]),
      passwordConfirm: new FormControl(''),
    }, { 
      validators: [passwordsMatchValidator] 
    });
  }

  ngOnInit(): void {
    this.cargarPerfil(this.userId);
  }

  // Función para cargar los datos del perfil del usuario
  cargarPerfil(id: number): void {
    if (!id) return;
    const url = `${this.apiUrl}/${id}`;

    this.http.get<PerfilUsuario>(url).subscribe({
      next: (perfilRecibido) => {
        this.perfil = perfilRecibido;
        // Rellenar el formulario con los datos recibidos
        this.perfilForm.patchValue({
          id: perfilRecibido.id,
          nombre: perfilRecibido.nombre,
          apellido: perfilRecibido.apellido,
          email: perfilRecibido.email,
          fechaNacimiento: perfilRecibido.fechaNacimiento,
          telefono: perfilRecibido.telefono,
          foto: perfilRecibido.foto,
        });
        // Si hay una foto, mostrarla como preview
        if (perfilRecibido.foto) {
          this.fotoPreview = perfilRecibido.foto;
        }
      },
      error: (err) => {
        console.error(`Error al cargar el perfil del usuario con ID ${id}`, err);
        // Podrías redirigir a una página de error o inicio
        // this.router.navigate(['/']);
      }
    });
  }

  // Manejador para la carga de una nueva foto de perfil
  onFotoChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
        // En una aplicación real, aquí subirías la imagen a un servidor
        // y actualizarías el campo 'foto' del formulario con la URL devuelta.
        // Por ahora, solo actualizamos el preview.
        // Ejemplo de actualización: 
        // this.perfilForm.get('foto')?.setValue('URL_DE_IMAGEN_SUBIDA');
      };
      reader.readAsDataURL(file);
    }
  }

  // Lógica para guardar los cambios del perfil
  guardarPerfil(): void {
    // Ejecutar la validación personalizada de contraseñas explícitamente si es necesario
    this.perfilForm.updateValueAndValidity();
    
    if (this.perfilForm.invalid) {
      console.log('El formulario no es válido. Por favor, revisa los campos.', this.perfilForm.errors);
      this.perfilForm.markAllAsTouched();
      alert('Por favor, corrige los errores del formulario antes de guardar.');
      return;
    }

    const datosFormulario = this.perfilForm.getRawValue();
    const usuarioId = datosFormulario.id;
    const url = `${this.apiUrl}/${usuarioId}`;

    // Creamos un objeto con solo los datos que queremos enviar, 
    // sin los campos de contraseña si no se rellenaron
    const datosParaGuardar: Partial<PerfilUsuario & { passwordActual?: string, passwordNueva?: string }> = {
      id: datosFormulario.id,
      nombre: datosFormulario.nombre,
      apellido: datosFormulario.apellido,
      email: datosFormulario.email,
      fechaNacimiento: datosFormulario.fechaNacimiento,
      telefono: datosFormulario.telefono,
      foto: datosFormulario.foto,
    };

    // Si hay intento de cambio de contraseña y es válido (lo validó el validator), 
    // incluimos las contraseñas para que el backend las procese
    if (datosFormulario.passwordNueva) {
      datosParaGuardar.passwordActual = datosFormulario.passwordActual;
      datosParaGuardar.passwordNueva = datosFormulario.passwordNueva;
    }

    this.http.put(url, datosParaGuardar).subscribe({
      next: (response) => {
        console.log('¡Perfil actualizado con éxito!', response);
        alert('¡Cambios guardados con éxito!');
        
        // Resetear los campos de contraseña después de un guardado exitoso
        this.perfilForm.get('passwordActual')?.reset('');
        this.perfilForm.get('passwordNueva')?.reset('');
        this.perfilForm.get('passwordConfirm')?.reset('');
        
        // Opcional: Redirigir o recargar datos
        // this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error al actualizar el perfil', err);
        // El error podría ser por contraseña actual incorrecta, email duplicado, etc.
        alert('Hubo un error al guardar los cambios. Verifica si tu contraseña actual es correcta.');
      }
    });
  }
}