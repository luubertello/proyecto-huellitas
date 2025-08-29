import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-iniciar-sesion',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './iniciar-sesion.html',
  styleUrl: './iniciar-sesion.css'
})
export class IniciarSesion implements OnInit {
  inicioSesionClienteform!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  errorMsg: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicioSesionClienteform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

  }

}
