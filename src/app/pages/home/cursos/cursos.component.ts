import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CURSOS_DATA } from '../../../core/data/cursos.data';
import { CursoItem, CursosModel } from '../../../core/models/cursos.model';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css',
})
export class CursosComponent {
  cursos: CursosModel = CURSOS_DATA;

  getCursosPorCategoria(categoriaNombre: string): CursoItem[] {
    // Filtramos del array principal de cursos
    return this.cursos.cursos.filter(
      (curso) => curso.categoria === categoriaNombre
    );
  }
}
