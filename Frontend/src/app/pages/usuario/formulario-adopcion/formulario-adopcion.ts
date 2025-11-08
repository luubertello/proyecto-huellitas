// Archivo: formulario-adopcion.ts

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-formulario-adopcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-adopcion.html',
  styleUrls: ['./formulario-adopcion.css']

})
export class FormularioAdopcion implements OnInit {
  
  isLoggedIn = false;
  adoptionForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  submissionSuccess = false;
  
  // Para la llamada al backend
  private animalId: string | null = null;
  private apiUrl = 'http://localhost:3000/solicitudes';
  isLoading = false;
  errorMessage = '';

  private platformId = inject(PLATFORM_ID); 

  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient       
  ) {
    this.adoptionForm = this.fb.group({
      // Paso 1
      motivoAdopcion: ['', [Validators.required, Validators.minLength(10)]],
      experienciaPrevia: ['', [Validators.required, Validators.minLength(10)]],

      // Paso 2
      tieneOtrosAnimales: [false, [Validators.required]], 
      cantidadPerros: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]], 
      cantidadGatos: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]], 
      otrasEspeciesDescripcion: [{ value: '', disabled: true }], 

      // Paso 3
      tipoVivienda: ['', [Validators.required]], // OK con ''
      tienePatio: [{ value: null as boolean | null, disabled: true }, [Validators.required]], 
      tieneBalcon: [{ value: null as boolean | null, disabled: true }, [Validators.required]], 
      balconConProteccion: [{ value: null as boolean | null, disabled: true }, [Validators.required]], 
      medidasDeSeguridad: ['', [Validators.required, Validators.minLength(10)]], 

      // Paso 4
      tiempoAnimalSoloHoras: [0, [Validators.required, Validators.min(0), Validators.max(24)]], 
      compromisoPaseos: [false, [Validators.requiredTrue]], 
      compromisoGastosVet: [false, [Validators.requiredTrue]], 
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.isLoggedIn = !!token;
    } else {
      this.isLoggedIn = false;
    }

    if (this.isLoggedIn) {
      this.animalId = this.route.snapshot.paramMap.get('id');
      if (!this.animalId) {
        console.error("¡ERROR! No se encontró el ID del animal en la URL.");
        this.errorMessage = "Error: No se especificó el animal para adoptar.";
      }
      this.setupConditionalLogic();
  }
}

  // Lógica condicional
  private setupConditionalLogic(): void {
    // Usamos .get() para obtener los controles
    const tieneOtrosAnimalesControl = this.adoptionForm.get('tieneOtrosAnimales');
    const tipoViviendaControl = this.adoptionForm.get('tipoVivienda');
    const tieneBalconControl = this.adoptionForm.get('tieneBalcon');

    // Para "Otros Animales"
    tieneOtrosAnimalesControl?.valueChanges.subscribe(value => {
      this.toggleControls(value === true, ['cantidadPerros', 'cantidadGatos', 'otrasEspeciesDescripcion']);
    });

    // Para "Vivienda"
    tipoViviendaControl?.valueChanges.subscribe(value => {
      this.toggleControls(value === 'Casa', ['tienePatio']);
      this.toggleControls(value === 'Departamento', ['tieneBalcon']);
      if (value !== 'Departamento') {
        this.toggleControls(false, ['balconConProteccion']);
      }
    });

    // Para "Balcón con Protección"
    tieneBalconControl?.valueChanges.subscribe(value => {
       // Usamos .get() para leer el valor actual
       const esDepto = this.adoptionForm.get('tipoVivienda')?.value === 'Departamento';
       this.toggleControls(esDepto && value === true, ['balconConProteccion']);
    });

    this.toggleControls(false, ['cantidadPerros', 'cantidadGatos', 'otrasEspeciesDescripcion', 'tienePatio', 'tieneBalcon', 'balconConProteccion']);
  }

  // Habilita/deshabilita y resetea controles
  private toggleControls(enable: boolean, controlNames: string[]): void {
    controlNames.forEach(name => {
      const control = this.adoptionForm.get(name);
      if (enable) {
        control?.enable();
      } else {
        control?.disable();
        control?.reset(); 
      }

      control?.updateValueAndValidity();
    });
  }


  // --- Navegación entre pasos ---
  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      console.warn(`Paso ${this.currentStep} inválido`);
      this.markStepControlsAsTouched(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  isStepValid(step: number): boolean {
    const controlsPerStep: { [key: number]: string[] } = {
      1: ['motivoAdopcion', 'experienciaPrevia'],
      2: ['tieneOtrosAnimales', 'cantidadPerros', 'cantidadGatos', 'otrasEspeciesDescripcion'],
      3: ['tipoVivienda', 'tienePatio', 'tieneBalcon', 'balconConProteccion', 'medidasDeSeguridad'],
      4: ['tiempoAnimalSoloHoras', 'compromisoPaseos', 'compromisoGastosVet']
    };
    
    return controlsPerStep[step]?.every(controlName => {
      const control = this.adoptionForm.get(controlName);
      return control?.disabled || control?.valid; 
    });
  }

  private markStepControlsAsTouched(step: number): void {
     const controlsPerStep: { [key: number]: string[] } = {
      1: ['motivoAdopcion', 'experienciaPrevia'],
      2: ['tieneOtrosAnimales', 'cantidadPerros', 'cantidadGatos', 'otrasEspeciesDescripcion'],
      3: ['tipoVivienda', 'tienePatio', 'tieneBalcon', 'balconConProteccion', 'medidasDeSeguridad'],
      4: ['tiempoAnimalSoloHoras', 'compromisoPaseos', 'compromisoGastosVet']
    };
    controlsPerStep[step]?.forEach(controlName => {
      this.adoptionForm.get(controlName)?.markAsTouched();
    });
  }


  // --- Envío al Backend ---
  onSubmit(): void {
    if (!this.isStepValid(this.totalSteps)) {
      this.markStepControlsAsTouched(this.totalSteps);
      console.error('El último paso del formulario tiene errores.');
      return;
    }

    if (!this.animalId) {
       this.errorMessage = "Error crítico: No se ha especificado el animal a adoptar.";
       return;
    }

    if (this.adoptionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.adoptionForm.getRawValue(); 
      
      const dataToSend = {
        ...formValue,
        animalId: Number(this.animalId) 
      };

      console.log('Enviando al backend:', dataToSend);

      this.http.post(this.apiUrl, dataToSend).pipe(
        catchError(err => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error al enviar la solicitud. Intente más tarde.';
          console.error('Error en POST:', err);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.isLoading = false;
          this.submissionSuccess = true;
        }
      });

    } else {
      console.error('El formulario completo tiene errores.');
      this.adoptionForm.markAllAsTouched();
    }
  }

  // --- Reinicio y Navegación ---
  reiniciarFormulario(): void {
    this.submissionSuccess = false;
    this.currentStep = 1;
    this.adoptionForm.reset();
    this.setupConditionalLogic(); 
  }

}