import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProgramacionCursoService } from '../../../../../core/services/programacion-curso.service';
import { CursoDiplomadoService } from '../../../../../core/services/curso-diplomado.service';
import { UsuariosService } from '../../../../../core/services/usuarios.service';
import { LucideAngularModule, Calendar, Clock, DollarSign, User, BookOpen, Save, ArrowLeft, AlertCircle, Search } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-crear-programacion-curso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-crear-programacion-curso.component.html',
  styleUrl: './admin-crear-programacion-curso.component.css'
})
export class AdminCrearProgramacionCursoComponent implements OnInit {
  // servicios
  private programacionService = inject(ProgramacionCursoService);
  private cursoService = inject(CursoDiplomadoService);
  private usuariosService = inject(UsuariosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // iconos
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly DollarSignIcon = DollarSign;
  readonly UserIcon = User;
  readonly BookOpenIcon = BookOpen;
  readonly SaveIcon = Save;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly AlertCircleIcon = AlertCircle;
  readonly SearchIcon = Search;

  isEditMode = false;
  programacionId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  submitError: string | null = null;

  cursos: any[] = [];
  docentes: any[] = [];
  
  // búsqueda y selección de cursos
  courseSearchTerm = signal('');
  showDropdown = false;
  selectedCurso: any = null;

  filteredCursos = computed(() => {
    const term = this.courseSearchTerm().toLowerCase();
    if (!term) return this.cursos.slice(0, 5); // mostrar los primeros 5 por defecto
    return this.cursos.filter(c => c.titulo.toLowerCase().includes(term));
  });

  // datos del formulario
  idCursoDiplomado: number | null = null;
  modalidad: string = 'VIRTUAL';
  duracionCurso: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  monto: number | null = null;
  numeroCuotas: number | null = null;
  duracionMeses: number | null = null;
  horario: string = '';
  idDocente: number | null = null;

  ngOnInit(): void {
    this.loadDependencies();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.programacionId = +id;
        this.loadProgramacion(this.programacionId);
      }
    });
  }

  loadDependencies(): void {
    this.cursoService.listar().subscribe({
      next: (data) => this.cursos = data,
      error: (err) => console.error('Error loading courses:', err)
    });

    this.usuariosService.listarPorRol('DOCENTE').subscribe({
      next: (data) => this.docentes = data,
      error: (err) => console.error('Error loading teachers:', err)
    });
  }

  loadProgramacion(id: number): void {
    this.isLoading = true;
    this.programacionService.obtenerPorId(id).subscribe({
      next: (data: any) => {
        this.idCursoDiplomado = data.idCursoDiplomado;
        this.selectedCurso = this.cursos.find(c => c.idCursoDiplomado === this.idCursoDiplomado);
        
        this.modalidad = data.modalidad || 'PRESENCIAL';
        this.duracionCurso = data.duracionCurso;
        this.fechaInicio = data.fechaInicio;
        this.fechaFin = data.fechaFin;
        this.monto = data.monto;
        this.numeroCuotas = data.numeroCuotas;
        this.duracionMeses = data.duracionMeses;
        this.horario = data.horario || '';
        this.idDocente = data.idDocente;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading programacion:', err);
        Swal.fire('Error', 'No se pudo cargar la programación', 'error');
        this.router.navigate(['/admin/programacion-cursos']);
      }
    });
  }

  selectCurso(curso: any): void {
    this.selectedCurso = curso;
    this.idCursoDiplomado = curso.idCursoDiplomado;
    this.showDropdown = false;
    this.courseSearchTerm.set('');
  }

  clearSelection(): void {
    this.selectedCurso = null;
    this.idCursoDiplomado = null;
    this.courseSearchTerm.set('');
  }

  onCourseSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.courseSearchTerm.set(input.value);
    this.showDropdown = true;
  }

  onFocus(): void {
    this.showDropdown = true;
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    this.submitError = null;

    const formData = {
      idCursoDiplomado: this.idCursoDiplomado,
      modalidad: this.modalidad,
      duracionCurso: this.duracionCurso,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      monto: this.monto,
      numeroCuotas: this.numeroCuotas,
      duracionMeses: this.duracionMeses,
      horario: this.horario,
      idDocente: this.idDocente
    };

    const request = this.isEditMode && this.programacionId
      ? this.programacionService.actualizar(this.programacionId, formData)
      : this.programacionService.crear(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: `Programación ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`,
          icon: 'success',
          confirmButtonColor: '#ff4d00'
        }).then(() => {
          this.router.navigate(['/admin/programacion-cursos']);
        });
      },
      error: (err) => {
        console.error('Error submitting form:', err);
        this.submitError = err.error?.message || 'Error al guardar la programación';
        this.isSubmitting = false;
        Swal.fire('Error', this.submitError || 'Error desconocido', 'error');
      }
    });
  }

  validateForm(): boolean {
    if (!this.idCursoDiplomado) {
      this.submitError = 'Debe seleccionar un curso o diplomado';
      return false;
    }
    if (!this.fechaInicio || !this.fechaFin) {
      this.submitError = 'Las fechas de inicio y fin son requeridas';
      return false;
    }
    if (!this.monto || this.monto <= 0) {
      this.submitError = 'El monto debe ser mayor a 0';
      return false;
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/admin/programacion-cursos']);
  }
}
