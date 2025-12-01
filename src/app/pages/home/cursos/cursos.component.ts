import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomado } from '../../../core/models/curso-diplomado.model';

import { DescuentoService } from '../../../core/services/descuento.service';
import { Descuento, DescuentoAplicacion } from '../../../core/models/descuento.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent implements OnInit {
  private cursoDiplomadoService = inject(CursoDiplomadoService);
  private descuentoService = inject(DescuentoService);

  cursos: CursoDiplomado[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  
  activeDiscounts: Descuento[] = [];
  applications: DescuentoAplicacion[] = [];

  // extraer categorias
  categorias: Array<{ id: string; nombre: string; descuento?: string }> = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      cursos: this.cursoDiplomadoService.listarCursos(),
      descuentos: this.descuentoService.listar(),
      apps: this.descuentoService.listarAplicaciones()
    }).subscribe({
      next: ({ cursos, descuentos, apps }) => {
        this.cursos = cursos;
        
        const now = new Date();
        this.activeDiscounts = descuentos.filter(d => {
          const start = new Date(d.fechaInicio);
          const end = new Date(d.fechaFin);
          return d.vigente && start <= now && end >= now;
        });
        
        this.applications = apps;
        
        this.extraerCategorias();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
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
      ([id, nombre]) => {
        const catId = Number(id);
        const discount = this.getCategoryDiscount(catId);
        return { 
          id: id.toString(), 
          nombre,
          descuento: discount
        };
      }
    );
  }

  getCategoryDiscount(catId: number): string | undefined {
    if (!this.applications || !this.activeDiscounts) return undefined;

    const relevantApps = this.applications.filter(a => 
      a.tipoAplicacion === 'CATEGORIA' && Number(a.idCategoria) === Number(catId)
    );
    
    if (relevantApps.length === 0) return undefined;
    let bestVal = -1;
    let bestText = '';

    for (const app of relevantApps) {
      const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
      if (discount && discount.valor > bestVal) {
        bestVal = discount.valor;
        bestText = discount.tipoDescuento === 'PORCENTAJE' ? `-${discount.valor}%` : `-S/.${discount.valor}`;
      }
    }
    
    return bestVal > -1 ? bestText : undefined;
  }

  getCursoDiscount(curso: CursoDiplomado): string | undefined {
    if (!this.applications || !this.activeDiscounts) return undefined;

    // 1. Specific course discount
    const courseApps = this.applications.filter(a => 
      a.tipoAplicacion === 'CURSO' && Number(a.idCursoDiplomado) === Number(curso.idCursoDiplomado)
    );

    let bestVal = -1;
    let bestText = '';

    for (const app of courseApps) {
      const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
      if (discount && discount.valor > bestVal) {
        bestVal = discount.valor;
        bestText = discount.tipoDescuento === 'PORCENTAJE' ? `-${discount.valor}%` : `-S/.${discount.valor}`;
      }
    }

    if (bestVal > -1) return bestText;

    // 2. Category discount
    if (curso.categoria && curso.categoria.idCategoria) {
      const catDiscount = this.getCategoryDiscount(curso.categoria.idCategoria);
      if (catDiscount) return catDiscount;
    }

    // 3. Fallback to GENERAL discount
    const generalApps = this.applications.filter(a => a.tipoAplicacion === 'GENERAL');
    let bestGeneralVal = -1;
    let bestGeneralText = '';

    for (const app of generalApps) {
      const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
      if (discount && discount.valor > bestGeneralVal) {
        bestGeneralVal = discount.valor;
        bestGeneralText = discount.tipoDescuento === 'PORCENTAJE' ? `-${discount.valor}%` : `-S/.${discount.valor}`;
      }
    }

    return bestGeneralVal > -1 ? bestGeneralText : undefined;
  }

  getCursosPorCategoria(categoriaNombre: string): CursoDiplomado[] {
    return this.cursos.filter(
      (curso) => curso.categoria?.nombre === categoriaNombre
    );
  }
}
