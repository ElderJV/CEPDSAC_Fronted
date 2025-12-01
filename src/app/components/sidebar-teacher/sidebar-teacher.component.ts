import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-sidebar-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-teacher.component.html',
  styleUrl: './sidebar-teacher.component.css'
})  

export class SidebarTeacherComponent {
  authService = inject(AuthService);
  router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}


