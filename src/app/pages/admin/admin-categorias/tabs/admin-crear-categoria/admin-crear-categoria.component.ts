import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../../../core/services/categoria.service';
import { CategoriaCreateDTO, CategoriaUpdateDTO } from '../../../../../core/models/categoria.model';
import Swal from 'sweetalert2';
import { LucideAngularModule, Save, X, Tag, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-admin-crear-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './admin-crear-categoria.component.html',
  styleUrls: ['../../../admin-styles.css']
})
export class AdminCrearCategoriaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoriaForm: FormGroup;
  isEditMode = signal(false);
  categoriaId = signal<number | null>(null);
  isLoading = signal(false);

  readonly Save = Save;
  readonly X = X;
  readonly Tag = Tag;
  readonly ArrowLeft = ArrowLeft;

  constructor() {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.categoriaId.set(Number(id));
      this.cargarCategoria(Number(id));
    }
  }

  cargarCategoria(id: number): void {
    this.isLoading.set(true);
    this.categoriaService.obtener(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar categoría', err);
        Swal.fire('Error', 'No se pudo cargar la categoría', 'error');
        this.router.navigate(['/admin/categorias']);
      }
    });
  }

  guardar(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.categoriaForm.value;

    if (this.isEditMode() && this.categoriaId()) {
      const updateDto: CategoriaUpdateDTO = {
        idCategoria: this.categoriaId()!,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion
      };

      this.categoriaService.actualizar(updateDto).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
          this.router.navigate(['/admin/categorias']);
        },
        error: (err) => {
          console.error('Error al actualizar categoría', err);
          Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
          this.isLoading.set(false);
        }
      });
    } else {
      const createDto: CategoriaCreateDTO = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion
      };

      this.categoriaService.crear(createDto).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
          this.router.navigate(['/admin/categorias']);
        },
        error: (err) => {
          console.error('Error al crear categoría', err);
          Swal.fire('Error', 'No se pudo crear la categoría', 'error');
          this.isLoading.set(false);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
