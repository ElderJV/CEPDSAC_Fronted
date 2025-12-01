import { Routes } from '@angular/router';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UserCursosComponent } from './user-cursos/user-cursos.component';
import { UserDiplomadosComponent } from './user-diplomados/user-diplomados.component';
import { UserPagosComponent } from './user-pagos/user-pagos.component';

// rutas de user para inyectar en el sidebar
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: DashboardUserComponent,
    pathMatch: 'full',
  },
  {
    path: 'cursos',
    component: UserCursosComponent,
  },
  {
    path: 'diplomados',
    component: UserDiplomadosComponent,
  },
  {
    path: 'pagos',
    component: UserPagosComponent,
  },
];
