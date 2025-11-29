import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramacionCursoResponse } from '../../../core/models/programacion-curso';
import { ProgramacionCursoService } from '../../../core/services/programacion-curso.service';
import Swal from 'sweetalert2';
import { LucideAngularModule, Calendar, Plus, Search, Info, User, CalendarCheck, CalendarX, Users, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-admin-programacion-curso',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-programacion-curso.component.html',
  styleUrls: ['../../admin/admin-styles.css', './admin-programacion-curso.component.css']
})
export class AdminProgramacionCursoComponent implements OnInit {
  programaciones = signal<ProgramacionCursoResponse[]>([]);
  isLoading = signal(true);
  
  currentPage = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');

  readonly Calendar = Calendar;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Info = Info;
  readonly User = User;
  readonly CalendarCheck = CalendarCheck;
  readonly CalendarX = CalendarX;
  readonly Users = Users;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  filteredProgramaciones = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.programaciones().filter(p => 
      p.nombreCursoDiplomado.toLowerCase().includes(term) ||
      p.nombreDocente?.toLowerCase().includes(term)
    );
  });

  paginatedProgramaciones = computed(() => {
    const startIndex = this.currentPage() * this.pageSize();
    return this.filteredProgramaciones().slice(startIndex, startIndex + this.pageSize());
  });

  totalElements = computed(() => this.filteredProgramaciones().length);
  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  constructor(
    private programacionService: ProgramacionCursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProgramaciones();
  }

  cargarProgramaciones(): void {
    this.isLoading.set(true);
    this.programacionService.listar().subscribe({
      next: (data) => {
        this.programaciones.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando programaciones:', err);
        Swal.fire('Error', 'Error al cargar las programaciones', 'error');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm.set(event.target.value);
    this.currentPage.set(0);
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onNew(): void {
    this.router.navigate(['/admin/programacion-cursos/nuevo']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin/programacion-cursos/editar', id]);
  }

  onDelete(item: ProgramacionCursoResponse): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.programacionService.eliminar(item.idProgramacionCurso).subscribe({
          next: () => {
            this.cargarProgramaciones();
            Swal.fire(
              '¡Eliminado!',
              'La programación ha sido eliminada.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error eliminando programación:', err);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la programación.',
              'error'
            );
          }
        });
      }
    });
  }
}
