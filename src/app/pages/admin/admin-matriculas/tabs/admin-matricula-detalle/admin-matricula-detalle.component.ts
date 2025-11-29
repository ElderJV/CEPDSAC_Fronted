import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatriculaService } from '../../../../../core/services/matricula.service';
import { PagoService } from '../../../../../core/services/pago.service';
import { MetodoPagoService } from '../../../../../core/services/metodo-pago.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ErrorHandlerService } from '../../../../../core/services/error-handler.service';
import { MatriculaDetalleResponse, PagoResponse, PagoCreateDTO } from '../../../../../core/models/matricula.model';
import { MetodoPago } from '../../../../../core/models/configuracion.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DescuentoService } from '../../../../../core/services/descuento.service';

import { LucideAngularModule, FileText, CircleX, ArrowLeft, DollarSign, CheckCircle, Hourglass, PieChart, User, Book, Award, Tag, CreditCard, PlusCircle, AlertCircle, Info } from 'lucide-angular';

@Component({
  selector: 'app-admin-matricula-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './admin-matricula-detalle.component.html',
  styleUrl: './admin-matricula-detalle.component.css'
})
export class AdminMatriculaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private matriculaService = inject(MatriculaService);
  private pagoService = inject(PagoService);
  private metodoPagoService = inject(MetodoPagoService);
  private toast = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);

  matriculaId: number | null = null;
  detalle = signal<MatriculaDetalleResponse | null>(null);
  metodosPago = signal<MetodoPago[]>([]);
  loading = signal(false);
  submitting = signal(false);
  private scrolledToPayment = false;

  pagoForm = this.fb.group({
    idMetodoPago: [null as number | null, Validators.required],
    monto: [null as number | null, [Validators.min(0.01)]],
    numeroOperacion: [''],
    observaciones: [''],
    fechaPago: [this.getCurrentDateTime()]
  });

  private getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  private descuentoService = inject(DescuentoService);
  
  descuentos = signal<any[]>([]);
  descuentoSeleccionado = signal<number | null>(null);

  readonly FileText = FileText;
  readonly CircleX = CircleX;
  readonly ArrowLeft = ArrowLeft;
  readonly DollarSign = DollarSign;
  readonly CheckCircle = CheckCircle;
  readonly Hourglass = Hourglass;
  readonly PieChart = PieChart;
  readonly User = User;
  readonly Book = Book;
  readonly Award = Award;
  readonly Tag = Tag;
  readonly CreditCard = CreditCard;
  readonly PlusCircle = PlusCircle;
  readonly AlertCircle = AlertCircle;
  readonly Info = Info;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.matriculaId = idParam ? +idParam : null;

    if (this.matriculaId) {
      this.cargarDetalle();
      this.cargarMetodosPago();
      this.cargarDescuentos();
    } else {
      this.toast.error('ID de matrícula inválido');
      this.router.navigate(['/admin/matriculas']);
    }
  }

  cargarDescuentos() {
    this.descuentoService.listar().subscribe({
      next: (data) => this.descuentos.set(data),
      error: () => console.error('Error al cargar descuentos')
    });
  }

  async aplicarDescuento() {
    if (!this.matriculaId || !this.descuentoSeleccionado()) return;

    const confirmed = await this.toast.confirm(
      '¿Aplicar Descuento?',
      '¿Estás seguro de aplicar este descuento? Se recalcularán los montos.'
    );

    if (confirmed) {
      this.matriculaService.aplicarDescuento(this.matriculaId, this.descuentoSeleccionado()!).subscribe({
        next: () => {
          this.toast.success('Descuento aplicado correctamente');
          this.cargarDetalle();
          this.descuentoSeleccionado.set(null);
        },
        error: (err) => {
          this.toast.error('Error al aplicar descuento');
        }
      });
    }
  }

  async cancelarMatricula() {
    if (!this.matriculaId) return;
    
    const confirmed = await this.toast.confirm(
      '¿Cancelar Matrícula?',
      '¿Estás seguro de cancelar esta matrícula? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      this.matriculaService.cancelarMatricula(this.matriculaId).subscribe({
        next: () => {
          this.toast.success('Matrícula cancelada correctamente');
          this.cargarDetalle();
        },
        error: () => {
          this.toast.error('Error al cancelar la matrícula');
        }
      });
    }
  }

  cargarDetalle(): void {
    if (!this.matriculaId) return;
    
    this.loading.set(true);
    this.matriculaService.obtenerDetalleCompleto(this.matriculaId).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.loading.set(false);
        this.checkAndScrollToPayment();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error('Error al cargar detalle: ' + msg);
        this.router.navigate(['/admin/matriculas']);
      }
    });
  }

  private checkAndScrollToPayment(): void {
    const shouldScroll = this.route.snapshot.queryParamMap.get('registrarPago') === 'true';
    
    if (shouldScroll) {
      this.tryScroll(100, 3);
    }
  }

  private tryScroll(delay: number, attempts: number): void {
    setTimeout(() => {
      const element = document.getElementById('payment-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!this.scrolledToPayment) {
          this.toast.info('Por favor, registra el pago de la cuota aquí.');
          this.scrolledToPayment = true;
        }
      } else if (attempts > 0) {
        this.tryScroll(delay + 200, attempts - 1);
      }
    }, delay);
  }

  cargarMetodosPago(): void {
    this.metodoPagoService.obtenerActivos().subscribe({
      next: (metodos) => {
        this.metodosPago.set(metodos);
        if (metodos.length > 0) {
          this.pagoForm.patchValue({ idMetodoPago: metodos[0].idMetodoPago });
        }
      },
      error: (err: HttpErrorResponse) => {
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error('Error al cargar métodos de pago: ' + msg);
      }
    });
  }

  registrarPago(): void {
    if (this.pagoForm.invalid || !this.matriculaId) {
      this.toast.error('Por favor completa el formulario correctamente');
      return;
    }

    const formValue = this.pagoForm.value;
    const dto: PagoCreateDTO = {
      idMatricula: this.matriculaId,
      idMetodoPago: formValue.idMetodoPago!,
      monto: formValue.monto || undefined,
      numeroOperacion: formValue.numeroOperacion || undefined,
      observaciones: formValue.observaciones || undefined,
      fechaPago: formValue.fechaPago ? formValue.fechaPago + ':00' : undefined
    };

    this.submitting.set(true);
    this.pagoService.registrarPago(dto).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Pago registrado correctamente');
        this.pagoForm.reset();
        if (this.metodosPago().length > 0) {
          this.pagoForm.patchValue({ idMetodoPago: this.metodosPago()[0].idMetodoPago });
        }
        this.cargarDetalle();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error('Error al registrar pago: ' + msg);
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-warning',
      'PAGADO': 'bg-success',
      'VENCIDA': 'bg-danger',
      'EN_PROCESO': 'bg-info',
      'CONFIRMADO': 'bg-success',
      'CANCELADO': 'bg-secondary'
    };
    return classes[estado] || 'bg-secondary';
  }

  getCuotaBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-warning',
      'PAGADO': 'bg-success',
      'VENCIDA': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
  }

  getTotalPagado(): number {
    const pagos = this.detalle()?.pagos || [];
    return pagos
      .filter(p => p.estadoCuota === 'PAGADO')
      .reduce((sum, p) => sum + (p.montoPagado || 0), 0);
  }

  getSaldoPendiente(): number {
    const detalle = this.detalle();
    if (!detalle) return 0;
    return detalle.monto - this.getTotalPagado();
  }

  getCuotasPagadas(): number {
    const pagos = this.detalle()?.pagos || [];
    return pagos.filter(p => p.estadoCuota === 'PAGADO').length;
  }

  getCuotasPendientes(): number {
    const pagos = this.detalle()?.pagos || [];
    return pagos.filter(p => p.estadoCuota === 'PENDIENTE').length;
  }

  estaVencida(fechaVencimiento?: string): boolean {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy;
  }
}
