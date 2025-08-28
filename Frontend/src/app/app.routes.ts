import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/iniciar-sesion/iniciar-sesion';
import { Inicio } from './pages/inicio/inicio';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
    { path: 'inicio-sesion', component: IniciarSesion },
    { path: 'inicio', component: Inicio },
    { path: 'registro', component: Registro },
    {path: '', redirectTo: 'inicio', pathMatch: 'full'}
];
