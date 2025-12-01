import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import Swal from 'sweetalert2';
import { LucideAngularModule, Tag, Plus, Edit, Trash, Info } from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-categorias.component.html',
  styleUrl: './admin-categorias.component.css'
})
export class AdminCategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  categorias: Categoria[] = [];

  readonly Tag = Tag;
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash = Trash;
  readonly Info = Info;

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al listar categorías', err);
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  irACrear(): void {
    this.router.navigate(['/admin/categorias/nuevo']);
  }

  irAEditar(id: number): void {
    this.router.navigate(['/admin/categorias/editar', id]);
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La categoría ha sido eliminada', 'success');
            this.listarCategorias();
          },
          error: (err) => {
            console.error('Error al eliminar categoría', err);
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
      }
    });
  }

  toggleEstado(categoria: Categoria): void {
    this.categoriaService.cambiarEstado(categoria.idCategoria).subscribe({
      next: () => {
        categoria.estado = !categoria.estado;
        const estado = categoria.estado ? 'activada' : 'desactivada';
        this.toastService.success(`La categoría ha sido ${estado}`);
      },
      error: (err) => {
        console.error('Error al cambiar estado', err);
        this.toastService.error('No se pudo cambiar el estado');
        categoria.estado = !categoria.estado;
      }
    });
  }
}
