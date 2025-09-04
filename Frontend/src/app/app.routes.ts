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
import { DonaDinero } from './pages/usuario/dona-dinero/dona-dinero';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { UsuarioLayout } from './layout/usuario-layout/usuario-layout';
import { Adopcion } from './pages/usuario/adopcion/adopcion';
import { EditarAnimal } from './pages/admin/editar-animal/editar-animal';

export const routes: Routes = [
   { 
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'registrar-animal', component: CrearAnimal }, // /admin/registrar-animal
      { path: 'gestion-animal', component: GestionarAnimales }, // /admin/gestion-animal
      { path: 'editar-animal', component: EditarAnimal }, // /admin/editar-animal
    ]},

  {
    path: '',
    component: UsuarioLayout,
    children: [
      { path: 'inicio', component: Inicio },
      {
        path: 'adopta',
        children: [
          { path: '', component: Adopcion },           // /adopta
          { path: 'gatos', component: AdoptaGatos },   // /adopta/gatos
          { path: 'perros', component: AdoptaPerros }, // /adopta/perros
          { path: 'requisitos', component: RequisitosAdopcion }, // /adopta/requisitos
          { path: 'formulario', component: FormularioAdopcion }, // /adopta/formulario
          { path: 'perfil-animal', component: PerfilAnimal }, // /adopta/perfil-animal
        ],
      },
      {
        path: 'donar',
        children: [
          { path: '', component: Donaciones },         // /donar
          { path: 'dinero', component: DonaDinero },  // /donar/dinero
          { path: 'insumos', component: DonaInsumos } // /donar/insumos
        ],
      },
    ],
  },


  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
