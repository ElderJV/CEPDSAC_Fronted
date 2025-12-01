import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Check, X, Trash2, AlertCircle, MessageSquare, Info, Plus, Edit } from 'lucide-angular';
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
  private router = inject(Router);

  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly TrashIcon = Trash2;
  readonly AlertIcon = AlertCircle;
  readonly MessageSquare = MessageSquare;
  readonly Info = Info;
  readonly Plus = Plus;
  readonly Edit = Edit;

  testimonios: Testimonio[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.cargarTestimonios();
  }

  irACrear(): void {
    this.router.navigate(['/admin/configuracion/testimonios/nuevo']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/configuracion/testimonios/editar', id]);
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

  toggleAprobacion(testimonio: Testimonio): void {
    const nuevoEstado = !testimonio.estadoAprobado;
    const accion = nuevoEstado ? 'aprobar' : 'desaprobar';

    Swal.fire({
      title: `¿${nuevoEstado ? 'Aprobar' : 'Desaprobar'} testimonio?`,
      text: `El testimonio será ${nuevoEstado ? 'visible' : 'oculto'} para el público.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testimonioService.aprobar(testimonio.idTestimonio, nuevoEstado).subscribe({
          next: () => {
            this.cargarTestimonios();
            Swal.fire('Actualizado', `Testimonio ${nuevoEstado ? 'aprobado' : 'desaprobado'} correctamente`, 'success');
          },
          error: (err) => {
            console.error(`Error al ${accion} testimonio`, err);
            Swal.fire('Error', `No se pudo ${accion} el testimonio`, 'error');
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
