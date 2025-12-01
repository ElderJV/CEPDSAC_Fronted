import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatriculaService } from '../../../core/services/matricula.service';
import { MatriculaCreateDTO, PagoResponse } from '../../../core/models/matricula.model';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDetalle, ProgramacionCursoSimple } from '../../../core/models/curso-diplomado.model';
import { AuthService } from '../../../auth/services/auth.service';
import { MetodoPagoService } from '../../../core/services/metodo-pago.service';
import { MetodoPago } from '../../../core/models/configuracion.model';
import { DescuentoService } from '../../../core/services/descuento.service';
import { Descuento, DescuentoAplicacion } from '../../../core/models/descuento.model';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matricula-general.component.html',
  styleUrls: ['./matricula-general.component.css']
})
export class MatriculaGeneralComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);
  private matriculaService = inject(MatriculaService);
  private toast = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);
  private cursoService = inject(CursoDiplomadoService);
  private authService = inject(AuthService);
  private metodoPagoService = inject(MetodoPagoService);
  private descuentoService = inject(DescuentoService);

  cursoId: number | null = null;
  programacionId: number | null = null;
  cursoDetalle: CursoDetalle | null = null;
  programacionSeleccionada: ProgramacionCursoSimple | null = null;
  loading = signal(false);
  matriculaCreada = signal(false);
  matriculaId = signal<number | null>(null);

  metodosPago: MetodoPago[] = [];
  metodoPagoSeleccionado: MetodoPago | null = null;
  loadingMetodos = signal(false);

  cuotas = signal<PagoResponse[]>([]);
  mostrarCuotas = signal(false);

  activeDiscounts: Descuento[] = [];
  applications: DescuentoAplicacion[] = [];

  contactPhoneDisplay = '956782481';
  get contactPhoneHref(): string {
    return `https://wa.me/51${this.contactPhoneDisplay}`;
  }

  form = this.fb.group({
    pagoPersonalizado: [false],
  });

  ngOnInit(): void {
    const cursoParam = this.route.snapshot.paramMap.get('cursoId');
    const programacionParam = this.route.snapshot.paramMap.get('programacionId');
    this.cursoId = cursoParam ? +cursoParam : null;
    this.programacionId = programacionParam ? +programacionParam : null;

    if (this.cursoId) {
      this.cursoService.obtenerDetalle(this.cursoId).subscribe({
        next: detalle => {
          this.cursoDetalle = detalle;
          if (this.cursoDetalle && this.programacionId) {
            this.programacionSeleccionada = this.cursoDetalle.programaciones.find(p => p.idProgramacionCurso === this.programacionId) || null;
          }
        },
        error: (err: HttpErrorResponse) => {
          const msg = this.errorHandler.getErrorMessage(err);
          this.toast.error(msg);
        }
      });
    }

    this.cargarMetodosPago();
    this.cargarDescuentos();
  }

  cargarDescuentos(): void {
    forkJoin({
      descuentos: this.descuentoService.listar(),
      apps: this.descuentoService.listarAplicaciones()
    }).subscribe({
      next: ({ descuentos, apps }) => {
        const now = new Date();
        this.activeDiscounts = descuentos.filter(d => {
          const start = new Date(d.fechaInicio);
          const end = new Date(d.fechaFin);
          end.setHours(23, 59, 59, 999);
          return d.vigente && start <= now && end >= now;
        });
        this.applications = apps;
      },
      error: (err) => console.error('Error loading discounts', err)
    });
  }

  cargarMetodosPago(): void {
    this.loadingMetodos.set(true);
    this.metodoPagoService.obtenerActivos().subscribe({
      next: (metodos) => {
        this.metodosPago = metodos;
        if (metodos.length > 0) {
          this.metodoPagoSeleccionado = metodos[0];
        }
        this.loadingMetodos.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loadingMetodos.set(false);
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error('Error cargando métodos de pago: ' + msg);
      }
    });
  }

  seleccionarMetodoPago(metodo: MetodoPago): void {
    this.metodoPagoSeleccionado = metodo;
  }

  submit() {
    if (!this.programacionId) {
      this.toast.error('Programación inválida.');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        title: 'Atención',
        text: 'Es necesario loguearse para continuar.',
        icon: 'warning',
        confirmButtonText: 'Ir a Registro',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/register']);
        }
      });
      return;
    }

    const pagoPersonalizadoRaw = this.form.value.pagoPersonalizado;
    const pagoPersonalizado: boolean | undefined = pagoPersonalizadoRaw == null
      ? undefined
      : !!pagoPersonalizadoRaw;

    const payload = this.authService.getTokenPayload();
    let idAlumno: number | undefined;

    if (payload) {
      const p = payload as any;
      const possible = p.id ?? p.userId ?? p.usuarioId ?? p.alumnoId;
      if (possible != null) {
        const asNumber = Number(possible);
        if (!isNaN(asNumber)) idAlumno = asNumber;
      }
    }

    const dto: MatriculaCreateDTO = {
      idProgramacionCurso: this.programacionId,
      pagoPersonalizado,
      ...(idAlumno !== undefined && { idAlumno })
    };

    this.loading.set(true);
    this.matriculaService.crear(dto).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.matriculaCreada.set(true);
        this.matriculaId.set(res.idMatricula);
        this.toast.success('Matrícula creada correctamente.', 5000);
        this.cargarCuotas(res.idMatricula);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        console.error('Matricula creation error:', err.status, err.error);
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error(msg);
      }
    });
  }

  notificarPago() {
    if (!this.metodoPagoSeleccionado) {
      this.toast.error('Por favor selecciona un método de pago.');
      return;
    }
    const id = this.matriculaId();
    if (id == null) {
      this.toast.error('No hay matrícula válida para notificar.');
      return;
    }
    this.matriculaService.notificarPago(id).subscribe({
      next: () => {
        this.toast.success('Se notificó a Administración para verificar el pago. Porfavor espere la confirmación que sera enviada a su correo', 5000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error notificando pago:', err.status, err.error);
        const msg = this.errorHandler.getErrorMessage(err);
        this.toast.error(msg);
      }
    });

  }

  cargarCuotas(idMatricula: number): void {
    this.matriculaService.obtenerDetalleCompleto(idMatricula).subscribe({
      next: (detalle) => {
        this.cuotas.set(detalle.pagos || []);
        this.mostrarCuotas.set(true);
      },
      error: (err) => {
        console.error('Error al cargar cuotas:', err);
      }
    });
  }

  getEstadoCuotaBadge(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-warning text-dark',
      'PAGADO': 'bg-success',
      'VENCIDA': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
  }

  estaVencida(fechaVencimiento: string): boolean {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy;
  }

  getCuotasPagadas(): number {
    return this.cuotas().filter(c => c.estadoCuota === 'PAGADO').length;
  }

  getCuotasPendientes(): number {
    return this.cuotas().filter(c => c.estadoCuota === 'PENDIENTE').length;
  }

  getPrimeraCuota(): number {
    if (!this.programacionSeleccionada) return 0;

    const monto = this.montoFinal;
    const numeroCuotas = this.programacionSeleccionada.numeroCuotas ?? 1;

    if (numeroCuotas <= 1) {
      return monto;
    }
    return monto / numeroCuotas;
  }

  getTextoMontoPago(): string {
    if (!this.programacionSeleccionada) return 'S/. 0.00';
    const numeroCuotas = this.programacionSeleccionada.numeroCuotas ?? 1;
    if (numeroCuotas <= 1) {
      return `S/. ${this.montoFinal.toFixed(2)}`;
    }

    const primeraCuota = this.getPrimeraCuota();
    return `S/. ${primeraCuota.toFixed(2)} (Primera cuota de ${numeroCuotas})`;
  }

  get descuentoAplicable(): { valor: number, tipo: 'PORCENTAJE' | 'MONTO', texto: string } | null {
    if (!this.cursoDetalle) return null;

    // 1. Specific course discount
    const courseApps = this.applications.filter(a => 
      a.tipoAplicacion === 'CURSO' && Number(a.idCursoDiplomado) === Number(this.cursoDetalle!.idCursoDiplomado)
    );

    let bestDiscount: Descuento | null = null;

    for (const app of courseApps) {
      const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
      if (discount) {
        if (!bestDiscount || discount.valor > bestDiscount.valor) {
          bestDiscount = discount;
        }
      }
    }

    if (bestDiscount) {
      return {
        valor: bestDiscount.valor,
        tipo: bestDiscount.tipoDescuento,
        texto: bestDiscount.tipoDescuento === 'PORCENTAJE' ? `-${bestDiscount.valor}%` : `-S/.${bestDiscount.valor}`
      };
    }

    // 2. Category discount
    if (this.cursoDetalle.idCategoria) {
      const catApps = this.applications.filter(a => 
        a.tipoAplicacion === 'CATEGORIA' && Number(a.idCategoria) === Number(this.cursoDetalle!.idCategoria)
      );
      
      for (const app of catApps) {
        const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
        if (discount) {
           if (!bestDiscount || discount.valor > bestDiscount.valor) {
            bestDiscount = discount;
          }
        }
      }
      
      if (bestDiscount) {
        return {
          valor: bestDiscount.valor,
          tipo: bestDiscount.tipoDescuento,
          texto: bestDiscount.tipoDescuento === 'PORCENTAJE' ? `-${bestDiscount.valor}%` : `-S/.${bestDiscount.valor}`
        };
      }
    }

    // 3. General discount
    const generalApps = this.applications.filter(a => a.tipoAplicacion === 'GENERAL');
    for (const app of generalApps) {
      const discount = this.activeDiscounts.find(d => d.idDescuento === app.idDescuento);
      if (discount) {
         if (!bestDiscount || discount.valor > bestDiscount.valor) {
          bestDiscount = discount;
        }
      }
    }

    if (bestDiscount) {
      return {
        valor: bestDiscount.valor,
        tipo: bestDiscount.tipoDescuento,
        texto: bestDiscount.tipoDescuento === 'PORCENTAJE' ? `-${bestDiscount.valor}%` : `-S/.${bestDiscount.valor}`
      };
    }

    return null;
  }

  get montoFinal(): number {
    if (!this.programacionSeleccionada) return 0;
    const precioOriginal = this.programacionSeleccionada.monto;
    const descuento = this.descuentoAplicable;

    if (!descuento) return precioOriginal;

    if (descuento.tipo === 'PORCENTAJE') {
      return precioOriginal * (1 - descuento.valor / 100);
    } else {
      return Math.max(0, precioOriginal - descuento.valor);
    }
  }
}
