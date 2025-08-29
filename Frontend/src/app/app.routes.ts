import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/iniciar-sesion/iniciar-sesion';
import { Inicio } from './pages/inicio/inicio';
import { Registro } from './pages/registro/registro';
import { AdoptaGatos } from './pages/adopta-gatos/adopta-gatos';
import { AdoptaPerros } from './pages/adopta-perros/adopta-perros';
import { Donaciones } from './pages/donaciones/donaciones';
import { DonaInsumos } from './pages/dona-insumos/dona-insumos';
import { PerfilAnimal } from './pages/perfil-animal/perfil-animal';
import { FormularioAdopcion } from './pages/formulario-adopcion/formulario-adopcion';
import { RequisitosAdopcion } from './pages/requisitos-adopcion/requisitos-adopcion';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },

  {
    path: 'adopcion',
    children: [
      { path: 'gatos', component: AdoptaGatos },
      { path: 'perros', component: AdoptaPerros },
      { path: 'perfil-animal', component: PerfilAnimal },
      { path: 'formulario', component: FormularioAdopcion },
      { path: 'requisitos', component: RequisitosAdopcion },
      { path: '', redirectTo: 'adopcion', pathMatch: 'full' } // redirección por defecto
    ]
  },

  { path: 'donaciones', component: Donaciones },
  { path: 'dona-insumos', component: DonaInsumos },
  { path: 'inicio-sesion', component: IniciarSesion },
  { path: 'registro', component: Registro },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
