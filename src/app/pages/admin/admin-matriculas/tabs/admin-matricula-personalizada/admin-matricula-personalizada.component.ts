import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserPlus, Search, ChevronRight, ArrowLeft, User, CheckCircle, XCircle, GraduationCap, BookOpen, ClipboardCheck, FileText, Banknote } from 'lucide-angular';
import { UsuariosService } from '../../../../../core/services/usuarios.service';
import { ProgramacionCursoService } from '../../../../../core/services/programacion-curso.service';
import { MatriculaService } from '../../../../../core/services/matricula.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Usuario } from '../../../../../core/models/usuarios.model';
import { ProgramacionCursoResponse } from '../../../../../core/models/programacion-curso';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-matricula-personalizada',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
  templateUrl: './admin-matricula-personalizada.component.html',
  styleUrl: './admin-matricula-personalizada.component.css'
})
export class AdminMatriculaPersonalizadaComponent implements OnInit {
  readonly UserPlusIcon = UserPlus;
  readonly SearchIcon = Search;
  readonly ChevronRightIcon = ChevronRight;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly UserIcon = User;
  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly GraduationCapIcon = GraduationCap;
  readonly BookOpenIcon = BookOpen;
  readonly ClipboardCheckIcon = ClipboardCheck;
  readonly FileTextIcon = FileText;
  readonly BanknoteIcon = Banknote;

  currentStep = signal(1);
  
  alumnos = signal<Usuario[]>([]);
  programaciones = signal<ProgramacionCursoResponse[]>([]);
  alumnoSearchTerm = signal('');
  cursoSearchTerm = signal('');
  
  selectedAlumno = signal<Usuario | null>(null);
  selectedProgramacion = signal<ProgramacionCursoResponse | null>(null);
  
  isLoadingAlumnos = signal(false);
  isLoadingCursos = signal(false);
  isSubmitting = signal(false);

  filteredAlumnos = computed(() => {
    const term = this.alumnoSearchTerm().toLowerCase();
    return this.alumnos().filter(a => 
      a.nombre.toLowerCase().includes(term) || 
      a.apellido.toLowerCase().includes(term) || 
      a.numeroIdentificacion.includes(term)
    );
  });

  filteredProgramaciones = computed(() => {
    const term = this.cursoSearchTerm().toLowerCase();
    return this.programaciones().filter(p => 
      p.nombreCursoDiplomado.toLowerCase().includes(term)
    );
  });

  constructor(
    private usuariosService: UsuariosService,
    private programacionService: ProgramacionCursoService,
    private matriculaService: MatriculaService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlumnos();
    this.loadProgramaciones();
  }

  loadAlumnos() {
    this.isLoadingAlumnos.set(true);
    this.usuariosService.listarPorRol('ALUMNO').subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.isLoadingAlumnos.set(false);
      },
      error: (err) => {
        this.toast.error('Error al cargar alumnos');
        this.isLoadingAlumnos.set(false);
      }
    });
  }

  loadProgramaciones() {
    this.isLoadingCursos.set(true);
    this.programacionService.listarDisponibles().subscribe({
      next: (data) => {
        this.programaciones.set(data);
        this.isLoadingCursos.set(false);
      },
      error: (err) => {
        this.toast.error('Error al cargar programaciones');
        this.isLoadingCursos.set(false);
      }
    });
  }

  selectAlumno(alumno: Usuario) {
    this.selectedAlumno.set(alumno);
    this.nextStep();
  }

  selectProgramacion(prog: ProgramacionCursoResponse) {
    this.selectedProgramacion.set(prog);
    this.nextStep();
  }

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update(v => v + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
    }
  }

  confirmarMatricula() {
    const alumno = this.selectedAlumno();
    const prog = this.selectedProgramacion();
    
    if (!alumno || !prog) {
      this.toast.error('Faltan datos para la matrícula');
      return;
    }

    Swal.fire({
      title: '¿Confirmar matrícula?',
      html: `
        <div class="text-start">
          <p>Se matriculará al alumno:</p>
          <p><strong>${alumno.nombre} ${alumno.apellido}</strong></p>
          <p>En el curso/diplomado:</p>
          <p><strong>${prog.nombreCursoDiplomado}</strong></p>
          <p class="mt-2 text-primary">Monto: S/. ${prog.monto}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, matricular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff4d00',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearMatricula(alumno, prog);
      }
    });
  }

  private crearMatricula(alumno: Usuario, prog: ProgramacionCursoResponse) {
    this.isSubmitting.set(true);
    this.matriculaService.crear({
      idAlumno: alumno.idUsuario,
      idProgramacionCurso: prog.idProgramacionCurso,
      pagoPersonalizado: false
    }).subscribe({
      next: (resp) => {
        Swal.fire({
          title: '¡Matrícula Creada!',
          text: 'La matrícula se ha registrado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#ff4d00'
        }).then(() => {
          this.router.navigate(['/admin/matriculas']);
        });
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error(err.error?.message || 'Error al crear matrícula');
        this.isSubmitting.set(false);
      }
    });
  }

  resetSelection() {
    this.selectedAlumno.set(null);
    this.selectedProgramacion.set(null);
    this.currentStep.set(1);
  }
}
