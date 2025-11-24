import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Check, X, Trash2, AlertCircle } from 'lucide-angular';
import { TestimonioService } from '../../../../../core/services/testimonio.service';
import { Testimonio } from '../../../../../core/models/testimonio.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-testimonios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './config-testimonios.component.html',
  styleUrl: './config-testimonios.component.css'
})
export class ConfigTestimoniosComponent implements OnInit {
  private testimonioService = inject(TestimonioService);

  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly TrashIcon = Trash2;
  readonly AlertIcon = AlertCircle;

  testimonios: Testimonio[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.cargarTestimonios();
  }

  cargarTestimonios(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.testimonioService.obtenerTodos().subscribe({
      next: (data) => {
        this.testimonios = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando testimonios:', err);
        this.errorMessage = 'No se pudieron cargar los testimonios';
        this.isLoading = false;
      }
    });
  }

  aprobarTestimonio(testimonio: Testimonio): void {
    Swal.fire({
      title: '¿Aprobar testimonio?',
      text: `Se aprobará el testimonio de ${testimonio.idUsuario.nombre} ${testimonio.idUsuario.apellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testimonioService.aprobar(testimonio.idTestimonio, true).subscribe({
          next: () => {
            Swal.fire('Aprobado', 'Testimonio aprobado correctamente', 'success');
            this.cargarTestimonios();
          },
          error: (err) => {
            console.error('Error aprobando testimonio:', err);
            Swal.fire('Error', 'No se pudo aprobar el testimonio', 'error');
          }
        });
      }
    });
  }

  rechazarTestimonio(testimonio: Testimonio): void {
    Swal.fire({
      title: '¿Rechazar testimonio?',
      text: `Se rechazará el testimonio de ${testimonio.idUsuario.nombre} ${testimonio.idUsuario.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testimonioService.aprobar(testimonio.idTestimonio, false).subscribe({
          next: () => {
            Swal.fire('Rechazado', 'Testimonio rechazado correctamente', 'success');
            this.cargarTestimonios();
          },
          error: (err) => {
            console.error('Error rechazando testimonio:', err);
            Swal.fire('Error', 'No se pudo rechazar el testimonio', 'error');
          }
        });
      }
    });
  }

  eliminarTestimonio(testimonio: Testimonio): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el testimonio de ${testimonio.idUsuario.nombre} ${testimonio.idUsuario.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testimonioService.eliminar(testimonio.idTestimonio).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Testimonio eliminado correctamente', 'success');
            this.cargarTestimonios();
          },
          error: (err) => {
            console.error('Error eliminando testimonio:', err);
            Swal.fire('Error', 'No se pudo eliminar el testimonio', 'error');
          }
        });
      }
    });
  }

  getEstadoBadgeClass(estadoAprobado: boolean | null): string {
    if (estadoAprobado === null) return 'badge-pending';
    return estadoAprobado ? 'badge-approved' : 'badge-rejected';
  }

  getEstadoTexto(estadoAprobado: boolean | null): string {
    if (estadoAprobado === null) return 'Pendiente';
    return estadoAprobado ? 'Aprobado' : 'Rechazado';
  }

  trackById(_: number, item: Testimonio) {
    return item.idTestimonio;
  }
}
