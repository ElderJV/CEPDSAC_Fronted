import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DiplomadoItem,
  DiplomadosModel,
} from '../../../core/models/diplomados.model';
import { DIPLOMADOS_DATA } from '../../../core/data/diplomados.data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-diplomados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './diplomados.component.html',
  styleUrl: './diplomados.component.css',
})
export class DiplomadosComponent {
  diplomados: DiplomadosModel = DIPLOMADOS_DATA;

  getDiplomadosPorCategoria(categoriaNombre: string): DiplomadoItem[] {
    // Filtramos del array principal de diplomados
    return this.diplomados.diplomados.filter(
      (diplomado) => diplomado.categoria === categoriaNombre
    );
  }
}
