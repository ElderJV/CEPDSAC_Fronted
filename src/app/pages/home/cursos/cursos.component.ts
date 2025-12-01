import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomado } from '../../../core/models/curso-diplomado.model';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent implements OnInit {
  private cursoDiplomadoService = inject(CursoDiplomadoService);

  cursos: CursoDiplomado[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // extraer categorias
  categorias: Array<{ id: string; nombre: string }> = [];

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.cursoDiplomadoService.listarCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.extraerCategorias();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('err', err);
        console.error('details', {
          status: err.status,
          message: err.message,
          url: err.url,
        });
        this.errorMessage = 'No se pudieron cargar los cursos';
        this.isLoading = false;
      },
    });
  }

  extraerCategorias(): void {
    const categoriasUnicas = new Map<number, string>();

    this.cursos.forEach((curso) => {
      if (curso.categoria && curso.categoria.estado) {
        categoriasUnicas.set(
          curso.categoria.idCategoria,
          curso.categoria.nombre
        );
      }
    });

    this.categorias = Array.from(categoriasUnicas.entries()).map(
      ([id, nombre]) => ({ id: id.toString(), nombre })
    );

    this.categorias.map((cat) => ({
      categoria: cat.nombre,
      cantidad: this.getCursosPorCategoria(cat.nombre).length,
    }));
  }

  getCursosPorCategoria(categoriaNombre: string): CursoDiplomado[] {
    return this.cursos.filter(
      (curso) => curso.categoria?.nombre === categoriaNombre
    );
  }
}
