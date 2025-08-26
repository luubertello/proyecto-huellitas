import { Routes } from '@angular/router';
import { IniciarSesion } from './pages/iniciar-sesion/iniciar-sesion';

export const routes: Routes = [
    { path: 'inicio-sesion', component: IniciarSesion },
    {path: '', redirectTo: 'inicio-sesion', pathMatch: 'full'}
];
