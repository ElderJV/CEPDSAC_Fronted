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

// Login y Register
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Pages del Admin
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminCursosComponent } from './pages/admin/admin-cursos/admin-cursos.component';
import { AdminDiplomadosComponent } from './pages/admin/admin-diplomados/admin-diplomados.component';
import { AdminEstudiantesComponent } from './pages/admin/admin-estudiantes/admin-estudiantes.component';
import { AdminProfesoresComponent } from './pages/admin/admin-profesores/admin-profesores.component';
import { AdminTestimoniosComponent } from './pages/admin/admin-testimonios/admin-testimonios.component';
import { AdminSponsorsComponent } from './pages/admin/admin-sponsors/admin-sponsors.component';
import { SponsorsResolver } from './core/resolvers/sponsors.resolver';

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
      },
      {
        path: 'diplomado/:id',
        component: DiplomadoComponent,
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
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'cursos',
        component: AdminCursosComponent,
        pathMatch: 'full',
      },
      {
        path: 'diplomados',
        component: AdminDiplomadosComponent,
        pathMatch: 'full',
      },
      {
        path: 'estudiantes',
        component: AdminEstudiantesComponent,
        pathMatch: 'full',
      },
      {
        path: 'profesores',
        component: AdminProfesoresComponent,
        pathMatch: 'full',
      },
      {
        path: 'testimonios',
        component: AdminTestimoniosComponent,
        pathMatch: 'full',
      },
      {
        path: 'sponsors',
        component: AdminSponsorsComponent,
        pathMatch: 'full',
        resolve: { sponsors: SponsorsResolver },
      },
      
    ],
  },
  { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registro', component: RegisterComponent },
  { path: '**', component: MainComponent },
];
