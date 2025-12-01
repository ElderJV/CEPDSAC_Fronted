import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { ProgramacionCursoSimpleDTO } from '../../../core/models/programacion.model';
import { AlumnoMatriculadoDTO } from '../../../core/models/matricula.model';
import { LucideAngularModule, Users, Calendar, Mail, Search, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-teacher-alumnos-curso',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './teacher-alumnos-curso.component.html',
  styleUrl: './teacher-alumnos-curso.component.css'
})
export class TeacherAlumnosCursoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cursoService = inject(CursoDiplomadoService);
  private matriculaService = inject(MatriculaService);

  // Icons
  Users = Users;
  Calendar = Calendar;
  Mail = Mail;
  Search = Search;
  ArrowLeft = ArrowLeft;

  idCurso = signal<number>(0);
  programaciones = signal<ProgramacionCursoSimpleDTO[]>([]);
  selectedProgramacion = signal<ProgramacionCursoSimpleDTO | null>(null);
  alumnos = signal<AlumnoMatriculadoDTO[]>([]);
  loading = signal<boolean>(true);
  loadingAlumnos = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('idCurso');
      if (id) {
        this.idCurso.set(+id);
        this.cargarProgramaciones(+id);
      }
    });
  }

  cargarProgramaciones(idCurso: number) {
    this.loading.set(true);
    this.cursoService.listarProgramacionesPorCursoDocente(idCurso).subscribe({
      next: (data) => {
        this.programaciones.set(data);
        this.loading.set(false);
        
        // Si solo hay una programación, seleccionarla automáticamente
        if (data.length === 1) {
          this.seleccionarProgramacion(data[0]);
        }
      },
      error: (err) => {
        console.error('Error cargando programaciones', err);
        this.loading.set(false);
      }
    });
  }

  seleccionarProgramacion(programacion: ProgramacionCursoSimpleDTO) {
    this.selectedProgramacion.set(programacion);
    this.cargarAlumnos(programacion.idProgramacionCurso);
  }

  cargarAlumnos(idProgramacion: number) {
    this.loadingAlumnos.set(true);
    this.matriculaService.listarAlumnosPorProgramacion(idProgramacion).subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.loadingAlumnos.set(false);
      },
      error: (err) => {
        console.error('Error cargando alumnos', err);
        this.loadingAlumnos.set(false);
      }
    });
  }
}
