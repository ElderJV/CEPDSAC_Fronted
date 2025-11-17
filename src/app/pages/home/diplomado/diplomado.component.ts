import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  diplomado: CursoDetalle | null = null;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDiplomado(+id);
    } else {
      this.toast.error('ID de diplomado no válido');
      this.isLoading = false;
    }
  }

  cargarDiplomado(id: number): void {
    this.isLoading = true;
    this.cursoDiplomadoService.obtenerDetalle(id).subscribe({
      next: (data) => {
        console.log('diplomado detalle:', data);
        this.diplomado = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('error cargando diplomado:', err);
        const mensaje = this.errorHandler.getErrorMessage(err);
        this.toast.error(mensaje);
        this.isLoading = false;
      }
    });
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
    return this.diplomado?.materialesIncluidos
      ? this.diplomado.materialesIncluidos.split('|').filter(m => m.trim())
      : [];
  }

  getRequisitosArray(): string[] {
    return this.diplomado?.requisitos
      ? this.diplomado.requisitos.split('|').filter(r => r.trim())
      : [];
  }
}
