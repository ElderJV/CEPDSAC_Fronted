import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatriculaService } from '../../../core/services/matricula.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MatriculaListResponse } from '../../../core/models/matricula.model';

@Component({
  selector: 'app-user-diplomados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-diplomados.component.html',
  styleUrl: './user-diplomados.component.css',
})
export class UserDiplomadosComponent implements OnInit {
  private matriculaService = inject(MatriculaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  diplomados: any[] = []; // Usamos esta variable para la vista
  isLoading = true;

  ngOnInit(): void {
    this.cargarDiplomados();
  }

  cargarDiplomados() {
    const usuario = this.authService.getUsuarioId();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.matriculaService.listarPorAlumno(usuario).subscribe({
      next: (data: MatriculaListResponse[]) => {
        this.diplomados = data.map((matricula) => ({
          id: matricula.idMatricula,
          nombre: matricula.tituloCurso,
          estado: matricula.estado,
          monto: matricula.monto,
          horario: matricula.horario,
          docente: matricula.nombreDocente,
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando diplomados', err);
        this.isLoading = false;
      },
    });
  }
}
