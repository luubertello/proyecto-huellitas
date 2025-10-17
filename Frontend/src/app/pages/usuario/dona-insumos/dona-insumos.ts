import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
//falta importar ngModel
@Component({
  selector: 'app-dona-insumos',
  imports: [],
  templateUrl: './dona-insumos.html',
  styleUrl: './dona-insumos.css'
})
export class DonaInsumos {
form = {
    tipoInsumo: 'alimentos',
    especie: 'perro',
    destinatario: 'adulto',
    cantidad: 1,
    entrega: 'fundacion'
  };
  donarInsumos() {
    console.log('Datos:', this.form);
  }
}

