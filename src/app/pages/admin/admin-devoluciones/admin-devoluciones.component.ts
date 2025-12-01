import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../core/services/pago.service';
import { ToastService } from '../../../core/services/toast.service';
import { PagoResponse } from '../../../core/models/matricula.model';
import { LucideAngularModule, DollarSign, Calendar, CreditCard, CheckCircle, AlertCircle, User, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-admin-devoluciones',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-devoluciones.component.html',
  styleUrl: './admin-devoluciones.component.css'
})
export class AdminDevolucionesComponent implements OnInit {
  private pagoService = inject(PagoService);
  private toast = inject(ToastService);

  pagos = signal<PagoResponse[]>([]);
  loading = signal(false);

  readonly DollarSign = DollarSign;
  readonly Calendar = Calendar;
  readonly CreditCard = CreditCard;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly User = User;
  readonly BookOpen = BookOpen;

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos() {
    this.loading.set(true);
    this.pagoService.listarPagosPorDevolver().subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pagos por devolver', err);
        this.toast.error('Error al cargar la lista de devoluciones pendientes.');
        this.loading.set(false);
      }
    });
  }

  async marcarDevuelto(pago: PagoResponse) {
    const confirmed = await this.toast.confirm(
      '¿Confirmar Devolución?',
      `¿Estás seguro de marcar como devuelto el pago de S/ ${pago.monto} del alumno ${pago.nombreAlumno}?`
    );

    if (confirmed) {
      this.pagoService.marcarComoDevuelto(pago.idPago).subscribe({
        next: () => {
          this.toast.success('Pago marcado como devuelto exitosamente.');
          this.cargarPagos();
        },
        error: (err) => {
          console.error('Error marcando devolución', err);
          this.toast.error('Error al procesar la devolución.');
        }
      });
    }
  }
}
