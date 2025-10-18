import { Component } from '@angular/core';

@Component({
  selector: 'app-dona-insumos',
  templateUrl: './dona-insumos.html',
  styleUrls: ['./dona-insumos.css']
})
export class DonaInsumos {
  form: any = {
    tipoInsumo: '',
    especie: '',
    destinatario: '',
    cantidad: 0,
    entrega: ''
  };

  onChange(event: Event, field: string) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.form[field] = target.value;
  }

  donarInsumos() {
    console.log('Formulario enviado:', this.form);
  }
}
