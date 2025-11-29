import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatriculaService } from '../../../core/services/matricula.service';
import { ToastService } from '../../../core/services/toast.service';
import { MatriculaAdminListItem, EstadoMatricula, ESTADO_BADGE_CLASSES } from '../../../core/models/matricula.model';
import { LucideAngularModule, CreditCard, Plus, Search, Info, AlertCircle, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-admin-matriculas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './admin-matriculas.component.html',
  styleUrl: './admin-matriculas.component.css'
})
export class AdminMatriculasComponent implements OnInit {
  matriculas = signal<MatriculaAdminListItem[]>([]);
  isLoading = signal(true);
  
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  dniFilter = signal('');
  estadoFilter = signal('');

  readonly CreditCard = CreditCard;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Info = Info;
  readonly AlertCircle = AlertCircle;
  readonly Eye = Eye;
  readonly Check = Check;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  constructor(
    private matriculaService: MatriculaService,
    private toast: ToastService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cargarMatriculas();
  }

  cargarMatriculas(): void {
    this.isLoading.set(true);
    this.matriculaService.listarMatriculasAdmin(
      this.currentPage(),
      this.pageSize(),
      this.dniFilter(),
      this.estadoFilter()
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        this.matriculas.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.error('Error al cargar matrículas');
        this.isLoading.set(false);
      }
    });
  }

  onDniInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (value !== numericValue) {
      input.value = numericValue;
    }
    
    this.dniFilter.set(numericValue);
  }

  onSearch(event: Event): void {
    this.currentPage.set(0); 
    this.cargarMatriculas();
  }

  onEstadoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.estadoFilter.set(select.value);
    this.currentPage.set(0);
    this.cargarMatriculas();
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.cargarMatriculas();
    }
  }

  async confirmarPago(idMatricula: number): Promise<void> {
    const confirmed = await this.toast.confirm(
      '¿Confirmar Pago?',
      'Se te redirigirá al detalle para registrar el pago de la cuota.'
    );

    if (confirmed) {
      this.router.navigate(['/admin/matriculas', idMatricula], {
        queryParams: { registrarPago: true }
      });
    }
  }

  async cancelarMatricula(id: number): Promise<void> {
    const confirmed = await this.toast.confirm(
      '¿Cancelar Matrícula?',
      '¿Estás seguro de cancelar esta matrícula? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      this.matriculaService.cancelarMatricula(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Matrícula cancelada correctamente');
            this.cargarMatriculas();
          },
          error: () => {
            this.toast.error('Error al cancelar la matrícula');
          }
        });
    }
  }

  getEstadoBadgeClass(estado: EstadoMatricula): string {
    return ESTADO_BADGE_CLASSES[estado] || 'badge-secondary';
  }
}