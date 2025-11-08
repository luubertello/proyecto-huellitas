
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; 


export const adminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const adminRoles = [
    'admin general',
    'responsable de adopciones',
    'responsable de animales',
    'responsable de donaciones',
    'responsable de inventarios'
  ];

  if (!authService.isAuthenticated()) {
    console.error('[AdminGuard] Acceso denegado: Usuario no autenticado.');
    router.navigate(['/iniciar-sesion']);
    return false;
  }

  const tienePermiso = adminRoles.some(role => authService.hasRole(role));

  if (tienePermiso) {
    return true; 
  } else {
    console.warn('[AdminGuard] Acceso denegado: El usuario no tiene rol de admin.');
    router.navigate(['/no-autorizado']);
    return false;
  }
};