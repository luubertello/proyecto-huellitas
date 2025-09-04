import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioHeader } from '../../core/usuario-header/usuario-header';

@Component({
  selector: 'app-usuario-layout',
  imports: [ RouterModule, UsuarioHeader],
  templateUrl: './usuario-layout.html',
  styleUrl: './usuario-layout.css'
})
export class UsuarioLayout {

}
