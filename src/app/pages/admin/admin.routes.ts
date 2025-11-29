import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminCursosComponent } from './admin-cursos/admin-cursos.component';
import { AdminDiplomadosComponent } from './admin-diplomados/admin-diplomados.component';
import { AdminEstudiantesComponent } from './admin-estudiantes/admin-estudiantes.component';
import { AdminProfesoresComponent } from './admin-profesores/admin-profesores.component';
import { AdminConfiguracionComponent } from './admin-configuracion/admin-configuracion.component';
import { AdminProgramacionCursoComponent } from './admin-programacion-curso/admin-programacion-curso.component';
import { AdminCrearProgramacionCursoComponent } from './admin-programacion-curso/tabs/admin-crear-programacion-curso/admin-crear-programacion-curso.component';
import { AdminMatriculasComponent } from './admin-matriculas/admin-matriculas.component';
import { AdminMatriculaPersonalizadaComponent } from './admin-matriculas/tabs/admin-matricula-personalizada/admin-matricula-personalizada.component';
import { AdminMatriculaDetalleComponent } from './admin-matriculas/tabs/admin-matricula-detalle/admin-matricula-detalle.component';
import { AdminMatriculaCancelarComponent } from './admin-programacion-curso/tabs/admin-programacion-cancelar/admin-matricula-cancelar.component';
import { AdminDescuentoComponent } from './admin-descuento/admin-descuento.component';

//rutas de admin para inyectar en el sidebar
export const ADMIN_ROUTES: Routes = [
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
    path: 'configuracion',
    component: AdminConfiguracionComponent,
    pathMatch: 'full',
  },
  {
    path: 'programacion-cursos',
    component: AdminProgramacionCursoComponent,
    pathMatch: 'full',
  },
  {
    path: 'programacion-cursos/nuevo',
    component: AdminCrearProgramacionCursoComponent,
    pathMatch: 'full',
  },
  {
    path: 'programacion-cursos/editar/:id',
    component: AdminCrearProgramacionCursoComponent,
    pathMatch: 'full',
  },
  {
    path: 'programacion-cursos/cancelar-masivo',
    component: AdminMatriculaCancelarComponent,
    pathMatch: 'full',
  },
  {
    path: 'matriculas',
    component: AdminMatriculasComponent,
    pathMatch: 'full',
  },
  {
    path: 'matriculas/personalizada',
    component: AdminMatriculaPersonalizadaComponent,
    pathMatch: 'full',
  },
  {
    path: 'matriculas/:id',
    component: AdminMatriculaDetalleComponent,
    pathMatch: 'full',
  },
  {
    path: 'descuentos',
    component: AdminDescuentoComponent,
    pathMatch: 'full',
  },
];
