import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css',
})
export class SidebarAdminComponent {
  showProgramacionSubmenu = false;
  showMatriculasSubmenu = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleProgramacionSubmenu() {
    this.showProgramacionSubmenu = !this.showProgramacionSubmenu;
  }

  toggleMatriculasSubmenu() {
    this.showMatriculasSubmenu = !this.showMatriculasSubmenu;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
