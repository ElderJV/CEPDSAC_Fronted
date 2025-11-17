import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomado } from '../../../core/models/curso-diplomado.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-diplomados',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './diplomados.component.html',
  styleUrl: './diplomados.component.css',
})
export class DiplomadosComponent implements OnInit {
  private cursoDiplomadoService = inject(CursoDiplomadoService);
  private errorHandler = inject(ErrorHandlerService);
  private toast = inject(ToastService);

  diplomados: CursoDiplomado[] = [];
  isLoading = true;

  //extraer categorias
  categorias: Array<{ id: string; nombre: string }> = [];

  ngOnInit(): void {
    this.cargarDiplomados();
  }

  cargarDiplomados(): void {
    this.isLoading = true;

    console.log('cargando diplomados api');

    this.cursoDiplomadoService.listarDiplomados().subscribe({
      next: (data) => {
        console.log('diplomados:', data);
        console.log('total', data.length);
        this.diplomados = data;
        this.extraerCategorias();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('error cargando diplomados:', err);
        const mensaje = this.errorHandler.getErrorMessage(err);
        this.toast.error(mensaje);
        this.isLoading = false;
      }
    });
  }

  extraerCategorias(): void {
    const categoriasUnicas = new Map<number, string>();
    this.diplomados.forEach(diplomado => {
      if (diplomado.categoria) {
        categoriasUnicas.set(diplomado.categoria.idCategoria, diplomado.categoria.nombre);
      }
    });

    this.categorias = Array.from(categoriasUnicas.entries()).map(
      ([id, nombre]) => ({ id: id.toString(), nombre })
    );

    console.log('categorias:', this.categorias);
    console.log('categorias x diplomado:',
      this.categorias.map(cat => ({
        categoria: cat.nombre,
        cantidad: this.getDiplomadosPorCategoria(cat.nombre).length
      }))
    );
  }

  getDiplomadosPorCategoria(categoriaNombre: string): CursoDiplomado[] {
    return this.diplomados.filter(
      (diplomado) => diplomado.categoria?.nombre === categoriaNombre
    );
  }
}
