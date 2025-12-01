import { Routes } from '@angular/router';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UserPagosComponent } from './user-pagos/user-pagos.component';
import { UserMatriculasComponent } from './user-matriculas/user-matriculas.component';
import { MaterialesComponent } from './user-matriculas/materiales/materiales.component';

// rutas de user para inyectar en el sidebar
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: DashboardUserComponent,
    pathMatch: 'full',
  },
  {
    path: 'matriculas',
    component: UserMatriculasComponent,
  },
  {
    path: 'matriculas/:id/materiales',
    component: MaterialesComponent,
  },
  {
    path: 'pagos',
    component: UserPagosComponent,
  },
];
