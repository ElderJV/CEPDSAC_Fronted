import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map, Observable } from 'rxjs';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.css',
})
export class SidebarUserComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  // Obtenemos el nombre del usuario logueado a traves del id en localStorage
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
