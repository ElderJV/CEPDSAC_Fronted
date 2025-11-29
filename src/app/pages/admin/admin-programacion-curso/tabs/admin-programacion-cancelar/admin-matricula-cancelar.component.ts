import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaService } from '../../../../../core/services/matricula.service';
import { ProgramacionCursoService } from '../../../../../core/services/programacion-curso.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MatriculaResponseDTO } from '../../../../../core/models/matricula.model';
import { ProgramacionCursoResponse } from '../../../../../core/models/programacion-curso';
import { LucideAngularModule, AlertTriangle, Info, Search, User, Calendar, Clock, Check } from 'lucide-angular';

@Component({
  selector: 'app-admin-matricula-cancelar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-matricula-cancelar.component.html',
  styleUrl: './admin-matricula-cancelar.component.css'
})
export class AdminMatriculaCancelarComponent implements OnInit {
  programaciones: ProgramacionCursoResponse[] = [];
  selectedProgramacionId: number | null = null;
  motivo: string = '';
  matriculasCanceladas: MatriculaResponseDTO[] = [];
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  searchTerm: string = '';

  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;
  readonly Search = Search;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Check = Check;

  constructor(
    private matriculaService: MatriculaService,
    private programacionCursoService: ProgramacionCursoService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarProgramaciones();
  }

  get filteredProgramaciones() {
    return this.programaciones.filter(prog => 
      prog.nombreCursoDiplomado.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      prog.nombreDocente.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  cargarProgramaciones() {
    this.programacionCursoService.listarDisponibles().subscribe({
      next: (data) => {
        this.programaciones = data;
      },
      error: (err) => {
        console.error('Error cargando programaciones', err);
        this.error = 'Error al cargar las programaciones de cursos.';
      }
    });
  }

  seleccionarProgramacion(prog: ProgramacionCursoResponse) {
    this.selectedProgramacionId = prog.idProgramacionCurso;
  }

  async cancelar() {
    if (!this.selectedProgramacionId) {
      this.error = 'Por favor seleccione una programación de curso.';
      return;
    }
    if (!this.motivo.trim()) {
      this.error = 'Por favor ingrese un motivo para la cancelación.';
      return;
    }

    const confirmed = await this.toast.confirm(
      '¿Cancelar Matrículas?',
      '¿Está seguro de que desea cancelar todas las matrículas asociadas a esta programación? Esta acción notificará a los alumnos y no se puede deshacer fácilmente.'
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;
    this.matriculasCanceladas = [];

    this.matriculaService.cancelarMatriculasPorProgramacion(this.selectedProgramacionId, this.motivo).subscribe({
      next: (data) => {
        this.matriculasCanceladas = data;
        this.success = `Se han cancelado ${data.length} matrículas exitosamente.`;
        this.loading = false;
        this.motivo = '';
        this.selectedProgramacionId = null;
        this.cargarProgramaciones();
      },
      error: (err) => {
        console.error('Error cancelando matrículas', err);
        this.error = 'Ocurrió un error al intentar cancelar las matrículas. Verifique la consola para más detalles.';
        this.loading = false;
      }
    });
  }
}
