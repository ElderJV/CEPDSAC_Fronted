import { Component, inject } from '@angular/core';
import { MatriculaService } from '../../../core/services/matricula.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatriculaListResponse } from '../../../core/models/matricula.model';

@Component({
  selector: 'app-user-matriculas',
  imports: [RouterLink],
  templateUrl: './user-matriculas.component.html',
  styleUrl: './user-matriculas.component.css',
})
export class UserMatriculasComponent {
  private matriculaService = inject(MatriculaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variable para la vista (Cards)
  cursos: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    const usuario = this.authService.getUsuarioId();
    console.log('UserCursos -> ID Usuario recuperado:', usuario);

    if (!usuario) {
      console.error('No hay usuario logueado');
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.matriculaService.listarPorAlumno(usuario).subscribe({
      next: (data: MatriculaListResponse[]) => {
        this.cursos = data.map((matricula: any) => {
          return {
            id: matricula.idMatricula,
            nombre: matricula.tituloCurso,
            estado: matricula.estado,
            horario: matricula.horario,
            docente: matricula.nombreDocente,
            monto: matricula.monto,
          };
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando cursos', err);
        this.isLoading = false;
      },
    });
  }
}
