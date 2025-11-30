import { Routes } from '@angular/router';

// Layouts
import { MainComponent } from './layout/main/main.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthGuard } from './auth/guards/auth.guard';

// Pages de la Home
import { HeroComponent } from './pages/home/hero/hero.component';
import { CursoComponent } from './pages/home/curso/curso.component';
import { DiplomadoComponent } from './pages/home/diplomado/diplomado.component';
import { CursosGeneralComponent } from './pages/home/cursos-general/cursos-general.component';
import { DiplomadosGeneralComponent } from './pages/home/diplomados-general/diplomados-general.component';
import { MatriculaGeneralComponent } from './pages/home/matricula-general/matricula-general.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HeroComponent,
        pathMatch: 'full',
      },
      {
        path: 'curso/:id',
        component: CursoComponent,
        pathMatch: 'full',
      },
      {
        path: 'diplomado/:id',
        component: DiplomadoComponent,
        pathMatch: 'full',
      },
      {
        path: 'cursos',
        component: CursosGeneralComponent,
        pathMatch: 'full',
      },
      {
        path: 'diplomados',
        component: DiplomadosGeneralComponent,
        pathMatch: 'full',
      },
      {
        path: 'matricula/:cursoId/:programacionId',
        component: MatriculaGeneralComponent,
        pathMatch: 'full',
      },
      {
        path: 'matricula/:cursoId/:programacionId',
        component: MatriculaGeneralComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/recuperar-pass/recuperar-pass.component').then(
        (m) => m.RecuperarPassComponent
      ),
  },
  { path: '**', component: MainComponent },
];
