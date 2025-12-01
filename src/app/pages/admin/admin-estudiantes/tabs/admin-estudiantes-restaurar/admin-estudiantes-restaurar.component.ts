import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../../../../core/services/usuarios.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Usuario } from '../../../../../core/models/usuarios.model';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, RefreshCw, Search, Info, UserX, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-admin-estudiantes-restaurar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './admin-estudiantes-restaurar.component.html',
  styleUrl: './admin-estudiantes-restaurar.component.css'
})
export class AdminEstudiantesRestaurarComponent implements OnInit {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);

  estudiantes = signal<Usuario[]>([]);
  loading = signal<boolean>(false);

  readonly RefreshCw = RefreshCw;
  readonly Search = Search;
  readonly Info = Info;
  readonly UserX = UserX;
  readonly ArrowLeft = ArrowLeft;

  ngOnInit(): void {
    this.cargarEstudiantesSuspendidos();
  }

  cargarEstudiantesSuspendidos(): void {
    this.loading.set(true);
    this.usuariosService.listarAlumnosSuspendidos().subscribe({
      next: (data) => {
        this.estudiantes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar estudiantes suspendidos', err);
        this.toastService.error('Error al cargar estudiantes suspendidos');
        this.loading.set(false);
      }
    });
  }

  async restaurar(estudiante: Usuario): Promise<void> {
    const confirmado = await this.toastService.confirm(
      '¿Restaurar Estudiante?',
      `¿Estás seguro de restaurar a ${estudiante.nombre} ${estudiante.apellido}? El estudiante volverá a tener acceso al sistema.`
    );

    if (confirmado) {
      this.usuariosService.restaurar(estudiante.idUsuario).subscribe({
        next: () => {
          this.toastService.success('Estudiante restaurado correctamente');
          this.cargarEstudiantesSuspendidos();
        },
        error: (err) => {
          console.error('Error al restaurar estudiante', err);
          this.toastService.error('Error al restaurar el estudiante');
        }
      });
    }
  }
}
