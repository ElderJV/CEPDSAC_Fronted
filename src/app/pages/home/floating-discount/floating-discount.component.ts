import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescuentoService } from '../../../core/services/descuento.service';
import { Descuento } from '../../../core/models/descuento.model';
import { LucideAngularModule, X, Tag } from 'lucide-angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-floating-discount',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './floating-discount.component.html',
  styleUrl: './floating-discount.component.css'
})
export class FloatingDiscountComponent implements OnInit {
  private descuentoService = inject(DescuentoService);
  
  activeDiscount = signal<Descuento | null>(null);
  discountScope = signal<string>('');
  isVisible = signal(false);
  
  readonly XIcon = X;
  readonly TagIcon = Tag;

  ngOnInit(): void {
    this.checkDiscounts();
  }

  checkDiscounts(): void {
    forkJoin({
      descuentos: this.descuentoService.listar(),
      aplicaciones: this.descuentoService.listarAplicaciones()
    }).subscribe({
      next: ({ descuentos, aplicaciones }) => {
        const now = new Date();
        
        // Filter active discounts
        const activeDiscounts = descuentos.filter(d => {
          const startDate = new Date(d.fechaInicio);
          const endDate = new Date(d.fechaFin);
          return d.vigente && startDate <= now && endDate >= now;
        });

        if (activeDiscounts.length === 0) return;

        // Find the "best" discount (highest value)
        let bestDiscount: Descuento | null = null;
        let bestApp: any = null;
        let maxVal = -1;

        for (const d of activeDiscounts) {
          // Find application for this discount
          const app = aplicaciones.find(a => a.idDescuento === d.idDescuento);
          
          if (d.valor > maxVal) {
            maxVal = d.valor;
            bestDiscount = d;
            bestApp = app;
          }
        }

        if (bestDiscount) {
          this.activeDiscount.set(bestDiscount);
          
          // Set description based on application
          if (bestApp) {
            if (bestApp.tipoAplicacion === 'CATEGORIA' && bestApp.nombreCategoria) {
              this.discountScope.set(`En cursos de ${bestApp.nombreCategoria}`);
            } else if (bestApp.tipoAplicacion === 'CURSO' && bestApp.tituloCursoDiplomado) {
              this.discountScope.set(`En ${bestApp.tituloCursoDiplomado}`);
            } else if (bestApp.tipoAplicacion === 'GENERAL') {
              this.discountScope.set('En todos los cursos');
            } else {
              this.discountScope.set('En todos los cursos');
            }
          } else {
             this.discountScope.set('En todos los cursos');
          }

          setTimeout(() => this.isVisible.set(true), 2000);
        }
      },
      error: (err) => console.error('Error fetching discounts', err)
    });
  }

  close(): void {
    this.isVisible.set(false);
  }
}
