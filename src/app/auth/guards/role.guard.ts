import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // 1. Validar que esté logueado (puedes omitir esto si ya usas AuthGuard antes)
    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    // 2. Obtener el rol esperado desde la configuración de la ruta
    const expectedRole = route.data['role'];
    const currentRole = this.auth.getRole();

    // 3. Si el rol coincide, DEJAR PASAR
    if (currentRole === expectedRole) {
      return true;
    }

    // 4. Si NO coincide, redirigir a su dashboard correspondiente
    // Esto evita que un Alumno vea una pantalla en blanco o error 403
    if (currentRole === 'ADMIN') {
      return this.router.createUrlTree(['/admin']);
    } else if (currentRole === 'ALUMNO') {
      return this.router.createUrlTree(['/user']);
    } else if (currentRole === 'DOCENTE') {
      return this.router.createUrlTree(['/teacher']);
    }

    // Por defecto al home o login
    return this.router.createUrlTree(['/login']);
  }
}
