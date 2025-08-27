import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/iniciar-sesion/iniciar-sesion';
import { Inicio } from './pages/inicio/inicio';

export const routes: Routes = [
    { path: 'inicio-sesion', component: IniciarSesion },
    { path: 'inicio', component: Inicio },
    {path: '', redirectTo: 'inicio-sesion', pathMatch: 'full'}
];
