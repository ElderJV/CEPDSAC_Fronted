import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Check, X, Trash2, AlertCircle, MessageSquare, Info, Plus, Edit, Save, ArrowLeft } from 'lucide-angular';
import { TestimonioService } from '../../../../../core/services/testimonio.service';
import { Testimonio } from '../../../../../core/models/testimonio.model';
import { UsuariosService } from '../../../../../core/services/usuarios.service';
import { Usuario } from '../../../../../core/models/usuarios.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-testimonios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './config-testimonios.component.html',
  styleUrl: './config-testimonios.component.css'
})
export class ConfigTestimoniosComponent implements OnInit {
  private testimonioService = inject(TestimonioService);
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly CheckIcon = Check;
  readonly XIcon = X;
  readonly TrashIcon = Trash2;
  readonly AlertIcon = AlertCircle;
  readonly MessageSquare = MessageSquare;
  readonly Info = Info;
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Save = Save;
  readonly ArrowLeft = ArrowLeft;

  testimonios: Testimonio[] = [];
  usuarios = signal<Usuario[]>([]);
  isLoading = true;
  errorMessage: string | null = null;

  // Form state
  showForm = signal(false);
  isEditMode = signal(false);
  testimonioId = signal<number | null>(null);
  testimonioForm: FormGroup;
  isSaving = signal(false);

  constructor() {
    this.testimonioForm = this.fb.group({
      idUsuario: [null, [Validators.required]],
      comentario: ['', [Validators.required, Validators.maxLength(500)]],
      estadoAprobado: [false]
    });
  }

  ngOnInit(): void {
    this.cargarTestimonios();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
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

  iniciarCreacion(): void {
    this.isEditMode.set(false);
    this.testimonioId.set(null);
    this.testimonioForm.reset({ estadoAprobado: false });
    this.showForm.set(true);
  }

  iniciarEdicion(testimonio: Testimonio): void {
    this.isEditMode.set(true);
    this.testimonioId.set(testimonio.idTestimonio);
    this.testimonioForm.patchValue({
      idUsuario: testimonio.idUsuario.idUsuario,
      comentario: testimonio.comentario,
      estadoAprobado: testimonio.estadoAprobado
    });
    this.showForm.set(true);
  }

  cancelar(): void {
    this.showForm.set(false);
    this.testimonioForm.reset();
  }

  guardar(): void {
    if (this.testimonioForm.invalid) {
      this.testimonioForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.testimonioForm.value;
    
    // Construct payload as requested: comentario, estadoAprobado, idUsuario (object with id)
    const payload = {
      comentario: formValue.comentario,
      estadoAprobado: formValue.estadoAprobado,
      idUsuario: { idUsuario: formValue.idUsuario }
    };

    if (this.isEditMode() && this.testimonioId()) {
      this.testimonioService.actualizar(this.testimonioId()!, payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Testimonio actualizado correctamente', 'success');
          this.isSaving.set(false);
          this.showForm.set(false);
          this.cargarTestimonios();
        },
        error: (err) => {
          console.error('Error al actualizar testimonio', err);
          Swal.fire('Error', 'No se pudo actualizar el testimonio', 'error');
          this.isSaving.set(false);
        }
      });
    } else {
      this.testimonioService.crear(payload).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Testimonio creado correctamente', 'success');
          this.isSaving.set(false);
          this.showForm.set(false);
          this.cargarTestimonios();
        },
        error: (err) => {
          console.error('Error al crear testimonio', err);
          Swal.fire('Error', 'No se pudo crear el testimonio', 'error');
          this.isSaving.set(false);
        }
      });
    }
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
