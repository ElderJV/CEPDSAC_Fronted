import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomado } from '../../../core/models/curso-diplomado.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

import { DescuentoService } from '../../../core/services/descuento.service';
import { Descuento, DescuentoAplicacion } from '../../../core/models/descuento.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-diplomados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './diplomados.component.html',
  styleUrls: ['./diplomados.component.css'],
})
export class DiplomadosComponent implements OnInit {
  private cursoDiplomadoService = inject(CursoDiplomadoService);
  private errorHandler = inject(ErrorHandlerService);
  private toast = inject(ToastService);
  private descuentoService = inject(DescuentoService);

  diplomados: CursoDiplomado[] = [];
  isLoading = true;
  
  activeDiscounts: Descuento[] = [];
  applications: DescuentoAplicacion[] = [];

  //extraer categorias
  categorias: Array<{ id: string; nombre: string; descuento?: string }> = [];

  ngOnInit(): void {
    this.cargarDiplomados();
  }

  cargarDiplomados(): void {
    this.isLoading = true;

    forkJoin({
      diplomados: this.cursoDiplomadoService.listarDiplomados(),
      descuentos: this.descuentoService.listar(),
      apps: this.descuentoService.listarAplicaciones()
    }).subscribe({
      next: ({ diplomados, descuentos, apps }) => {
        this.diplomados = diplomados;
        
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
      error: (err: HttpErrorResponse) => {
        console.error('error cargando diplomados:', err);
        const mensaje = this.errorHandler.getErrorMessage(err);
        this.toast.error(mensaje);
        this.isLoading = false;
      },
    });
  }

  extraerCategorias(): void {
    const categoriasUnicas = new Map<number, string>();
    this.diplomados.forEach((diplomado) => {
      if (diplomado.categoria && diplomado.categoria.estado) {
        categoriasUnicas.set(
          diplomado.categoria.idCategoria,
          diplomado.categoria.nombre
        );
      }
    });

    this.categorias = Array.from(categoriasUnicas.entries()).map(
      ([id, nombre]) => {
        const catId = Number(id);
        const discount = this.getCategoryDiscount(catId);
        return { id: id.toString(), nombre, descuento: discount };
      }
    );
  }

  getCategoryDiscount(catId: number): string | undefined {
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

  getDiplomadoDiscount(diplomado: CursoDiplomado): string | undefined {
    // 1. Check specific diploma discount
    const courseApps = this.applications.filter(a => 
      a.tipoAplicacion === 'CURSO' && Number(a.idCursoDiplomado) === Number(diplomado.idCursoDiplomado)
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

    // 2. Fallback to category discount
    if (diplomado.categoria) {
      const catDiscount = this.getCategoryDiscount(diplomado.categoria.idCategoria);
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

  getDiplomadosPorCategoria(categoriaNombre: string): CursoDiplomado[] {
    return this.diplomados.filter(
      (diplomado) => diplomado.categoria?.nombre === categoriaNombre
    );
  }
}
