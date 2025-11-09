import { Component } from '@angular/core';
import {
  Categoria,
  DiplomadoItem,
} from '../../../core/models/diplomados.model';
import { DIPLOMADOS_DATA } from '../../../core/data/diplomados.data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diplomados-general',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diplomados-general.component.html',
  styleUrl: './diplomados-general.component.css',
})
export class DiplomadosGeneralComponent {
  categorias: Categoria[] = DIPLOMADOS_DATA.categorias;
  diplomados: DiplomadoItem[] = DIPLOMADOS_DATA.diplomados;
}
