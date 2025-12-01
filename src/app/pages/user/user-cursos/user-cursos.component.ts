import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatriculaService } from '../../../core/services/matricula.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MatriculaListResponse } from '../../../core/models/matricula.model';

@Component({
  selector: 'app-user-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-cursos.component.html',
  styleUrl: './user-cursos.component.css',
})
export class UserCursosComponent implements OnInit {
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
    // Debug para ver qué está obteniendo
    console.log('UserCursos -> ID Usuario recuperado:', usuario);

    if (!usuario) {
      console.error('No hay usuario logueado');
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.matriculaService.listarPorAlumno(usuario).subscribe({
      next: (data: MatriculaListResponse[]) => {
        // Mapeo: Convertir respuesta del Backend -> Formato Visual de Card
        this.cursos = data.map((matricula) => {
          return {
            id: matricula.idMatricula, // Usamos ID Matricula para ir al detalle

            // Título y Categoría
            nombre: matricula.tituloCurso,
            // Lógica de Estado para el botón
            activo: matricula.estado === 'PAGADO',
            estado: matricula.estado,
            precio: matricula.monto,
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
