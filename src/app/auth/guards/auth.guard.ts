import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = this.auth.getToken();
    if (token && this.auth.isTokenValid(token)) {
      return true;
    }
    const returnUrl = encodeURIComponent(state.url || '/');
    return this.router.parseUrl(`/login?returnUrl=${returnUrl}`);
  }
}
