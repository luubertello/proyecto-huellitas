import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminHeader } from '../../core/admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  imports: [ RouterModule, AdminHeader],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
