import { Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { HeroComponent } from './hero/hero.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: MainComponent },
];
