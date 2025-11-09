import { Component } from '@angular/core';
import { Categoria, CursoItem } from '../../../core/models/cursos.model';
import { CURSOS_DATA } from '../../../core/data/cursos.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursos-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos-general.component.html',
  styleUrl: './cursos-general.component.css',
})
export class CursosGeneralComponent {
  categorias: Categoria[] = CURSOS_DATA.categorias;
  cursos: CursoItem[] = CURSOS_DATA.cursos;
}
