import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader {
  constructor(private router: Router) {}


goAnimales() {
    this.router.navigate(['/admin/animales']);
  }

goRegistrar() {
  this.router.navigate(['/admin/animales/registrar']);

  }
}
