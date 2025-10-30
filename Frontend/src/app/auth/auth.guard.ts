import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // <-- 3. Inyectar Platform ID

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');
    if (token) {
      return true; 
    }
  }

  router.navigate(['/iniciar-sesion']);
  return false;
};
