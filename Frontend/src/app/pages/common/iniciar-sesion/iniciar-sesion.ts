import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-iniciar-sesion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './iniciar-sesion.html',
  styleUrl: './iniciar-sesion.css',
  encapsulation: ViewEncapsulation.None
})
export class IniciarSesion implements OnInit {
  inicioSesionClienteform!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {}
  
  goRegistro() {
      this.router.navigate(['/registro']);
    }

  goAdopcionGatos() {
    this.router.navigate(['/adopcion/gatos']);
  }

  goAdopcionPerros() {
    this.router.navigate(['/adopcion/perros']);
  }

  goAdopcionFormulario() {
    this.router.navigate(['/adopcion/formulario']);
  }

  goAdopcionRequisitos() {
    this.router.navigate(['/adopcion/requisitos']);
  }

  goAdopcion() {
    this.router.navigate(['/adopcion']);
  }

  goDonar() {
    this.router.navigate(['/donaciones']);
  }

  goInicio() {
    this.router.navigate(['/inicio]']);
  }

  ngOnInit(): void {
    this.inicioSesionClienteform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

  }

}
