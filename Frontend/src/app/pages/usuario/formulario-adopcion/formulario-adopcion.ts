import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-adopcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-adopcion.html',
  styleUrls: ['./formulario-adopcion.css'],
  encapsulation: ViewEncapsulation.None,
  host: { 'ngSkipHydration': 'true' }
  
})
export class FormularioAdopcion implements OnInit {
  adoptionForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  submissionSuccess = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.adoptionForm = this.fb.group({
      // Paso 1
      motivoAdopcion: ['', Validators.required],
      experienciaPrevia: ['', Validators.required],

      // Paso 2
      tieneOtrosAnimales: [null, Validators.required],
      cantidadPerros: [{ value: 0, disabled: true }],
      cantidadGatos: [{ value: 0, disabled: true }],
      otrasEspeciesDescripcion: [{ value: '', disabled: true }],

      // Paso 3
      tipoVivienda: ['', Validators.required],
      tienePatio: [{ value: null, disabled: true }],
      tieneBalcon: [{ value: null, disabled: true }],
      balconConProteccion: [{ value: null, disabled: true }],
      medidasDeSeguridad: ['', Validators.required],

      // Paso 4
      tiempoAnimalSoloHoras: [null, [Validators.required, Validators.min(0), Validators.max(24)]],
      compromisoPaseos: [false, Validators.requiredTrue],
      compromisoGastosVet: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.setupConditionalValidators();
  }

  // Lógica para habilitar/deshabilitar campos según las respuestas
  private setupConditionalValidators(): void {
    const tieneOtrosAnimalesControl = this.adoptionForm.get('tieneOtrosAnimales');
    const tipoViviendaControl = this.adoptionForm.get('tipoVivienda');
    const tieneBalconControl = this.adoptionForm.get('tieneBalcon');

    // Para "Otros Animales"
    tieneOtrosAnimalesControl?.valueChanges.subscribe(value => {
      this.toggleControls(value, ['cantidadPerros', 'cantidadGatos', 'otrasEspeciesDescripcion']);
    });

    // Para "Vivienda"
    tipoViviendaControl?.valueChanges.subscribe(value => {
      this.toggleControls(value === 'Casa', ['tienePatio']);
      this.toggleControls(value === 'Departamento', ['tieneBalcon']);
    });

    // Para "Balcón con Protección"
    tieneBalconControl?.valueChanges.subscribe(value => {
      this.toggleControls(value, ['balconConProteccion']);
    });
  }

  private toggleControls(condition: boolean, controlNames: string[]): void {
    controlNames.forEach(name => {
      const control = this.adoptionForm.get(name);
      if (condition) {
        control?.enable();
        control?.setValidators(Validators.required);
      } else {
        control?.disable();
        control?.clearValidators();
        control?.reset();
      }
      control?.updateValueAndValidity();
    });
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  // Valida solo los campos del paso actual
  isStepValid(step: number): boolean {
    let isValid = true;
      const controls: { [key: number]: string[] } = {
    1: ['motivoAdopcion', 'experienciaPrevia'],
    2: ['tieneOtrosAnimales'],
    3: ['tipoVivienda', 'medidasDeSeguridad'],
    4: ['tiempoAnimalSoloHoras', 'compromisoPaseos', 'compromisoGastosVet']
  };
    
    controls[step]?.forEach(controlName => {
      const control = this.adoptionForm.get(controlName);
      if (control?.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });
    return isValid;
  }

  onSubmit(): void {
    if (this.adoptionForm.valid) {
      console.log('Formulario enviado:', this.adoptionForm.getRawValue());
      // Aquí iría la llamada a tu servicio para enviar los datos al backend
      // this.adopcionService.enviarFormulario(this.adoptionForm.getRawValue()).subscribe(...)
      this.submissionSuccess = true;
    } else {
      console.log('El formulario tiene errores.');
      this.adoptionForm.markAllAsTouched();
    }
  }

  reiniciarFormulario(): void {
    this.submissionSuccess = false;
    this.currentStep = 1;
    this.adoptionForm.reset();
  }
}