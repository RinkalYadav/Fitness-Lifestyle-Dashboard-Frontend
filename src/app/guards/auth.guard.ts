import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token.trim() !== '') {
    return true; // user allowed
  }

  router.navigate(['/login']); // no token → redirect
  return false;
};
