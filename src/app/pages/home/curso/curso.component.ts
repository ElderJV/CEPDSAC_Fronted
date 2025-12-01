import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDetalle } from '../../../core/models/curso-diplomado.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css'],
})
export class CursoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursoDiplomadoService = inject(CursoDiplomadoService);
  private errorHandler = inject(ErrorHandlerService);
  private toast = inject(ToastService);

  curso = signal<CursoDetalle | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarCurso(+id);
    } else {
      this.toast.error('ID de curso no válido');
      this.isLoading.set(false);
      this.router.navigate(['/']);
    }
  }

  cargarCurso(id: number): void {
    this.isLoading.set(true);
    this.cursoDiplomadoService.obtenerDetalle(id).subscribe({
      next: (data) => {
        this.curso.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('error cargando curso:', err);
        const mensaje = this.errorHandler.getErrorMessage(err);
        this.toast.error(mensaje);
        this.isLoading.set(false);
      },
    });
  }

  getModalidadLabel(modalidad: string): string {
    const labels: Record<string, string> = {
      PRESENCIAL: 'Presencial',
      VIRTUAL: 'Virtual',
      VIRTUAL_24_7: 'Virtual 24/7',
    };
    return labels[modalidad] || modalidad;
  }

  getNombreCompleto(prog: any): string {
    if (prog.nombreDocente && prog.apellidoDocente) {
      return `${prog.nombreDocente} ${prog.apellidoDocente}`;
    } else if (prog.nombreDocente) {
      return prog.nombreDocente;
    }
    return 'Por asignar';
  }

  getMaterialesArray(): string[] {
    const c = this.curso();
    return c?.materialesIncluidos
      ? c.materialesIncluidos.split('|').filter((m) => m.trim())
      : [];
  }

  getRequisitosArray(): string[] {
    const c = this.curso();
    return c?.requisitos ? c.requisitos.split('|').filter((r) => r.trim()) : [];
  }

  irAMatricula(cursoId: number | null, programacionId: number) {
    if (!programacionId || !cursoId) {
      this.toast.error('ID de curso o programación inválido');
      return;
    }
    this.router.navigate(['/matricula', cursoId, programacionId]);
  }

  comprar() {
    const c = this.curso();
    // Selecciona la primera programación disponible por defecto
    const first =
      c?.programaciones && c.programaciones.length > 0
        ? c.programaciones[0].idProgramacionCurso
        : null;

    const cursoId = c?.idCursoDiplomado ?? null;

    if (!first || !cursoId) {
      this.toast.error('No hay programaciones disponibles para comprar.');
      return;
    }
    this.irAMatricula(cursoId, first);
  }
}