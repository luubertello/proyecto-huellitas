// Archivo: src/app/auth/callback/auth-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-message">
      <p>Procesando inicio de sesión...</p> 
    </div>
  `,
  styles: [`
    .loading-message { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 200px; 
      font-size: 1.2rem; 
      color: var(--text-muted);
    }
  `]
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (token) {
      localStorage.setItem('authToken', token);
      
      this.router.navigate(['/inicio']); 

    } else if (error) {
      console.error('Error en el callback de Google:', error);
      this.router.navigate(['/iniciar-sesion'], { queryParams: { error: 'google_auth_failed' } });
      
    } else {
      console.error('Callback de Google sin token ni error.');
      this.router.navigate(['/iniciar-sesion']);
    }
  }
}