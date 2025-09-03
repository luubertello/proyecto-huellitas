import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/common/iniciar-sesion/iniciar-sesion';
import { Inicio } from './pages/usuario/inicio/inicio';
import { Registro } from './pages/common/registro/registro';
import { AdoptaGatos } from './pages/usuario/adopta-gatos/adopta-gatos';
import { AdoptaPerros } from './pages/usuario/adopta-perros/adopta-perros';
import { Donaciones } from './pages/usuario/donaciones/donaciones';
import { DonaInsumos } from './pages/usuario/dona-insumos/dona-insumos';
import { PerfilAnimal } from './pages/usuario/perfil-animal/perfil-animal';
import { FormularioAdopcion } from './pages/usuario/formulario-adopcion/formulario-adopcion';
import { RequisitosAdopcion } from './pages/usuario/requisitos-adopcion/requisitos-adopcion';
import { GestionarAnimales } from './pages/admin/gestionar-animales/gestionar-animales';
import { CrearAnimal } from './pages/admin/crear-animal/crear-animal';

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
  { path: 'gestion-animal', component: GestionarAnimales },
  { path: 'crear-animal', component: CrearAnimal },


  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
