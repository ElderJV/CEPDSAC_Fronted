import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDetalle } from '../../../core/models/curso-diplomado.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-diplomado',
  imports: [CommonModule],
  templateUrl: './diplomado.component.html',
  styleUrl: './diplomado.component.css',
})
export class DiplomadoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cursoDiplomadoService = inject(CursoDiplomadoService);
  private errorHandler = inject(ErrorHandlerService);
  private toast = inject(ToastService);
  private router = inject(Router);

  diplomado = signal<CursoDetalle | null>(null);
  isLoading = signal(true);
  cursoId: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cursoId = +id;
      this.cargarDiplomado(+id);
    } else {
      this.toast.error('ID de diplomado no válido');
      this.isLoading.set(false);
    }
  }

  cargarDiplomado(id: number): void {
    this.isLoading.set(true);
    this.cursoDiplomadoService.obtenerDetalle(id).subscribe({
      next: (data) => {
        console.log('diplomado detalle:', data);
        this.diplomado.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('error cargando diplomado:', err);
        const mensaje = this.errorHandler.getErrorMessage(err);
        this.toast.error(mensaje);
        this.isLoading.set(false);
      }
    });
  }

  matricularPrimer(): void {
    const d = this.diplomado();
    if (!d || !this.cursoId) {
      this.toast.error('No se pudo iniciar matrícula: diplomado no cargado.');
      return;
    }
    const programaciones = d.programaciones || [];
    if (programaciones.length === 0) {
      this.toast.error('No hay programaciones disponibles para matricular.');
      return;
    }
    const primerProg = programaciones[0];
    const progId = primerProg.idProgramacionCurso;
    if (!progId) {
      this.toast.error('ID de programación no disponible.');
      return;
    }
    this.router.navigate(['/matricula', this.cursoId, progId]);
  }

  getModalidadLabel(modalidad: string): string {
    const labels: Record<string, string> = {
      'PRESENCIAL': 'Presencial',
      'VIRTUAL': 'Virtual',
      'VIRTUAL_24_7': 'Virtual 24/7'
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
    const d = this.diplomado();
    return d?.materialesIncluidos
      ? d.materialesIncluidos.split('|').filter(m => m.trim())
      : [];
  }

  getRequisitosArray(): string[] {
    const d = this.diplomado();
    return d?.requisitos
      ? d.requisitos.split('|').filter(r => r.trim())
      : [];
  }
}
