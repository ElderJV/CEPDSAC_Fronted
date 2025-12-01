import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-sidebar-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-teacher.component.html',
  styleUrl: './sidebar-teacher.component.css',
})
export class SidebarTeacherComponent {
  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    private router: Router
  ) {}

  userName$!: Observable<string>;
  rolUser$!: Observable<string>;


  ngOnInit() {
    // inicializar observable del nombre de usuario (se hace en ngOnInit para evitar usar this antes del constructor)
    const userId = Number(localStorage.getItem('user_id')) || null;
    if (userId) {
      this.userName$ = this.usuariosService
        .obtener(userId)
        .pipe(map((user) => `${user.nombre} ${user.apellido}`));
      this.rolUser$ = this.usuariosService
        .obtener(userId)
        .pipe(map((user) => `${user.rol}`));
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
