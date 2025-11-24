import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Pencil, Trash2, Power, Upload, X } from 'lucide-angular';
import { MetodoPago, MetodoPagoRequestDTO } from '../../../../../core/models/configuracion.model';
import { MetodoPagoService } from '../../../../../core/services/metodo-pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-metodos-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './config-metodos-pago.component.html',
  styleUrl: './config-metodos-pago.component.css'
})
export class ConfigMetodosPagoComponent {
  private metodoPagoService = inject(MetodoPagoService);

  readonly PlusIcon = Plus;
  readonly PencilIcon = Pencil;
  readonly TrashIcon = Trash2;
  readonly PowerIcon = Power;
  readonly UploadIcon = Upload;
  readonly XIcon = X;

  metodosPago: MetodoPago[] = [];
  metodoEnEdicion: MetodoPago | null = null;
  nuevoMetodo: MetodoPagoRequestDTO = {
    tipoMetodo: '',
    descripcion: '',
    requisitos: '',
    imagenQR: '',
    activo: true
  };
  imagenQRPreview: string | null = null;
  archivoQRSeleccionado: File | null = null;
  mostrarFormularioMetodo = false;

  ngOnInit() {
    this.cargarMetodosPago();
  }

  cargarMetodosPago() {
    this.metodoPagoService.obtenerTodos().subscribe({
      next: (metodos) => {
        this.metodosPago = metodos;
      },
      error: (error) => {
        console.error('Error al cargar métodos de pago:', error);
        Swal.fire('Error', 'No se pudieron cargar los métodos de pago', 'error');
      }
    });
  }

  mostrarFormularioNuevoMetodo() {
    this.mostrarFormularioMetodo = true;
    this.metodoEnEdicion = null;
    this.nuevoMetodo = {
      tipoMetodo: '',
      descripcion: '',
      requisitos: '',
      imagenQR: '',
      activo: true
    };
    this.imagenQRPreview = null;
    this.archivoQRSeleccionado = null;
  }

  editarMetodo(metodo: MetodoPago) {
    this.mostrarFormularioMetodo = true;
    this.metodoEnEdicion = metodo;
    this.nuevoMetodo = {
      tipoMetodo: metodo.tipoMetodo,
      descripcion: metodo.descripcion || '',
      requisitos: metodo.requisitos || '',
      imagenQR: metodo.imagenQR || '',
      activo: metodo.activo
    };
    this.imagenQRPreview = metodo.imagenQR || null;
  }

  cancelarEdicion() {
    this.mostrarFormularioMetodo = false;
    this.metodoEnEdicion = null;
    this.nuevoMetodo = {
      tipoMetodo: '',
      descripcion: '',
      requisitos: '',
      imagenQR: '',
      activo: true
    };
    this.imagenQRPreview = null;
    this.archivoQRSeleccionado = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Por favor selecciona una imagen válida', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
        return;
      }
      this.archivoQRSeleccionado = file;
      // render preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenQRPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarMetodo() {
    if (!this.nuevoMetodo.tipoMetodo.trim()) {
      Swal.fire('Error', 'El tipo de método es requerido', 'error');
      return;
    }
    //si hay img , post a cloudi
    if (this.archivoQRSeleccionado) {
      Swal.fire({
        title: 'Subiendo imagen...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.metodoPagoService.subirImagenQR(this.archivoQRSeleccionado).subscribe({
        next: (response) => {
          this.nuevoMetodo.imagenQR = response.url;
          this.guardarMetodoConImagen();
        },
        error: (error) => {
          Swal.close();
          console.error('Error al subir imagen:', error);
          const mensaje = error.error?.error || 'No se pudo subir la imagen';
          Swal.fire('Error', mensaje, 'error');
        }
      });
    } else {
      //si no hay img, seteamos y guardamos
      this.guardarMetodoConImagen();
    }
  }

  private guardarMetodoConImagen() {
    if (this.metodoEnEdicion) {
      this.metodoPagoService.actualizar(this.metodoEnEdicion.idMetodoPago, this.nuevoMetodo).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Método de pago actualizado correctamente', 'success');
          this.cargarMetodosPago();
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al actualizar método:', error);
          const mensaje = error.error?.message || 'No se pudo actualizar el método de pago';
          Swal.fire('Error', mensaje, 'error');
        }
      });
    } else {
      this.metodoPagoService.crear(this.nuevoMetodo).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Método de pago creado correctamente', 'success');
          this.cargarMetodosPago();
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al crear método:', error);
          const mensaje = error.error?.message || 'No se pudo crear el método de pago';
          Swal.fire('Error', mensaje, 'error');
        }
      });
    }
  }

  cambiarEstadoMetodo(metodo: MetodoPago) {
    const nuevoEstado = !metodo.activo;
    this.metodoPagoService.cambiarEstado(metodo.idMetodoPago, nuevoEstado).subscribe({
      next: () => {
        Swal.fire('Éxito', `Método ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success');
        this.cargarMetodosPago();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
        const mensaje = error.error?.message || 'No se pudo cambiar el estado del método';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  eliminarMetodo(metodo: MetodoPago) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el método de pago "${metodo.tipoMetodo}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.metodoPagoService.eliminar(metodo.idMetodoPago).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Método de pago eliminado correctamente', 'success');
            this.cargarMetodosPago();
          },
          error: (error) => {
            console.error('Error al eliminar método:', error);
            const mensaje = error.error?.message || 'No se pudo eliminar el método de pago';
            Swal.fire('Error', mensaje, 'error');
          }
        });
      }
    });
  }
}
