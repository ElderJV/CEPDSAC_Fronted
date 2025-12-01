import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map, Subscription, Observable } from 'rxjs';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css'],
})
export class SidebarAdminComponent implements OnInit, OnDestroy {
  showProgramacionSubmenu = false;
  showMatriculasSubmenu = false;
  // identificador del item activo (puede ser 'programacion', 'matriculas' o null)
  activeItem: string | null = null;
  private routerSub?: Subscription;

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
    // mantener activo el item basado en la ruta actual y escuchar cambios de navegación
    this.updateActiveFromUrl(this.router.url);
    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.updateActiveFromUrl(ev.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  toggleProgramacionSubmenu() {
    // Si abrimos este submenu, cerramos el de matriculas
    this.showProgramacionSubmenu = !this.showProgramacionSubmenu;
    if (this.showProgramacionSubmenu) {
      this.showMatriculasSubmenu = false;
      this.activeItem = 'programacion';
    } else {
      // si se cierra manualmente, limpiar activeItem
      this.activeItem = null;
    }
  }

  toggleMatriculasSubmenu() {
    // Si abrimos este submenu, cerramos el de programacion
    this.showMatriculasSubmenu = !this.showMatriculasSubmenu;
    if (this.showMatriculasSubmenu) {
      this.showProgramacionSubmenu = false;
      this.activeItem = 'matriculas';
    } else {
      this.activeItem = null;
    }
  }

  /** Cerrar ambos submenús */
  closeAllSubmenus() {
    this.showMatriculasSubmenu = false;
    this.showProgramacionSubmenu = false;
    this.activeItem = null;
  }

  /** Indica si el menú de programación debe mostrarse como abierto (por toggle o por ruta activa) */
  isProgramacionOpen(): boolean {
    return (
      this.showProgramacionSubmenu ||
      this.router.url.startsWith('/admin/programacion-cursos')
    );
  }

  /** Indica si el menú de matriculas debe mostrarse como abierto (por toggle o por ruta activa) */
  isMatriculasOpen(): boolean {
    return (
      this.showMatriculasSubmenu ||
      this.router.url.startsWith('/admin/matriculas')
    );
  }

  /** Indica si el item padre debe mostrarse activo (por open o ruta hija activa) */
  isProgramacionActive(): boolean {
    return this.activeItem === 'programacion' || this.isProgramacionOpen();
  }

  isMatriculasActive(): boolean {
    return this.activeItem === 'matriculas' || this.isMatriculasOpen();
  }

  private updateActiveFromUrl(url: string) {
    if (url.startsWith('/admin/programacion-cursos')) {
      this.activeItem = 'programacion';
      this.showProgramacionSubmenu = true;
      this.showMatriculasSubmenu = false;
    } else if (url.startsWith('/admin/matriculas')) {
      this.activeItem = 'matriculas';
      this.showMatriculasSubmenu = true;
      this.showProgramacionSubmenu = false;
    } else {
      this.activeItem = null;
      // mantener submenus cerrados si la ruta no pertenece a ninguno
      this.showMatriculasSubmenu = false;
      this.showProgramacionSubmenu = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
