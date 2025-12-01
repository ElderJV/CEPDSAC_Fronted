
import { Routes } from "@angular/router";
import { TeacherAlumnosCursoComponent } from "./teacher-alumnos-curso/teacher-alumnos-curso.component";
import { TeacherDashboardComponent } from "./teacher-dashboard/teacher-dashboard.component";
import { TeacherDiplomadosComponent } from "./teacher-diplomados/teacher-diplomados.component";
import { TeacherCursosComponent } from "./teacher-cursos-diplomados/teacher-cursos-diplomados.component";

 export const TEACHER_ROUTES: Routes = [
    {
      path: '',
      component: TeacherDashboardComponent,
      pathMatch: 'full',
    },
    {
      path: 'cursos',
      component: TeacherCursosComponent,
    },
    {
      path: 'diplomados',
      component: TeacherDiplomadosComponent,
    },
    {
      path: 'cursos/:idCurso/alumnos',
      loadComponent: () => import('./teacher-alumnos-curso/teacher-alumnos-curso.component').then(m => m.TeacherAlumnosCursoComponent)
    },
    {
      path: 'diplomados/:idCurso/alumnos',
      loadComponent: () => import('./teacher-alumnos-curso/teacher-alumnos-curso.component').then(m => m.TeacherAlumnosCursoComponent)
    },
    {
      path: 'alumnos',
      component: TeacherAlumnosCursoComponent,
    },
    
];