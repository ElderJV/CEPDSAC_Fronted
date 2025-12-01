import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestimonioService } from '../../../../../../core/services/testimonio.service';
import { UsuariosService } from '../../../../../../core/services/usuarios.service';
import { Usuario } from '../../../../../../core/models/usuarios.model';
import Swal from 'sweetalert2';
import { LucideAngularModule, Save, X, MessageSquare, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-admin-crear-testimonio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './admin-crear-testimonio.component.html',
  styleUrls: ['../../../../admin-styles.css']
})
export class AdminCrearTestimonioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private testimonioService = inject(TestimonioService);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  testimonioForm: FormGroup;
  isEditMode = signal(false);
  testimonioId = signal<number | null>(null);
  isLoading = signal(false);
  usuarios = signal<Usuario[]>([]);

  readonly Save = Save;
  readonly X = X;
  readonly MessageSquare = MessageSquare;
  readonly ArrowLeft = ArrowLeft;

  constructor() {
    this.testimonioForm = this.fb.group({
      idUsuario: [null, [Validators.required]],
      comentario: ['', [Validators.required, Validators.maxLength(500)]],
      estadoAprobado: [false]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.testimonioId.set(Number(id));
      this.cargarTestimonio(Number(id));
    }
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

  cargarTestimonio(id: number): void {
    this.isLoading.set(true);
    this.testimonioService.obtenerPorId(id).subscribe({
      next: (testimonio) => {
        this.testimonioForm.patchValue({
          idUsuario: testimonio.idUsuario.idUsuario,
          comentario: testimonio.comentario,
          estadoAprobado: testimonio.estadoAprobado
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar testimonio', err);
        Swal.fire('Error', 'No se pudo cargar el testimonio', 'error');
        this.router.navigate(['/admin/configuracion/testimonios']);
      }
    });
  }

  guardar(): void {
    if (this.testimonioForm.invalid) {
      this.testimonioForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.testimonioForm.value;
    
    // Buscar el objeto usuario completo
    const usuarioSeleccionado = this.usuarios().find(u => u.idUsuario == formValue.idUsuario);

    const testimonioData = {
      ...formValue,
      idUsuario: usuarioSeleccionado // Enviar objeto usuario completo si el backend lo requiere así, o solo ID según DTO
    };
    
    // Ajuste: Si el backend espera solo el ID en un DTO de creación, ajustar aquí.
    // Asumiendo que el backend espera la entidad completa o un DTO compatible.
    // Dado que Testimonio entity tiene @ManyToOne Usuario idUsuario, el JSON debería ser { idUsuario: { idUsuario: ... } } o similar.
    // Vamos a enviar el objeto usuario completo que tiene el ID.
    
    if (this.isEditMode() && this.testimonioId()) {
      this.testimonioService.actualizar(this.testimonioId()!, testimonioData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Testimonio actualizado correctamente', 'success');
          this.router.navigate(['/admin/configuracion/testimonios']);
        },
        error: (err) => {
          console.error('Error al actualizar testimonio', err);
          Swal.fire('Error', 'No se pudo actualizar el testimonio', 'error');
          this.isLoading.set(false);
        }
      });
    } else {
      this.testimonioService.crear(testimonioData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Testimonio creado correctamente', 'success');
          this.router.navigate(['/admin/configuracion/testimonios']);
        },
        error: (err) => {
          console.error('Error al crear testimonio', err);
          Swal.fire('Error', 'No se pudo crear el testimonio', 'error');
          this.isLoading.set(false);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/configuracion/testimonios']);
  }
}
