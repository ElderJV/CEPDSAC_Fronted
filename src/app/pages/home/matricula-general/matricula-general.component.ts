
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatriculaService } from '../../../core/services/matricula.service';
import { MatriculaCreateDTO } from '../../../core/models/matricula.model';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDetalle, ProgramacionCursoSimple } from '../../../core/models/curso-diplomado.model';
import { AuthService } from '../../../auth/services/auth.service';

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

  cursoId: number | null = null;
  programacionId: number | null = null;
  cursoDetalle: CursoDetalle | null = null;
  programacionSeleccionada: ProgramacionCursoSimple | null = null;
  loading = signal(false);
  matriculaCreada = signal(false);
  matriculaId = signal<number | null>(null);

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
  }

  submit() {
    if (!this.programacionId) {
      this.toast.error('Programación inválida.');
      return;
    }
    try {
      console.log('Auth token (localStorage):', this.authService.getToken());
      console.log('Auth isLoggedIn():', this.authService.isLoggedIn());
      console.log('Auth token payload:', this.authService.getTokenPayload());
    } catch (e) { console.warn('Error printing auth info', e); }

    if (!this.authService.isLoggedIn()) {
      const currentUrl = this.router.url || `/matricula/${this.cursoId}/${this.programacionId}`;
      const returnUrl = encodeURIComponent(currentUrl);
      this.router.navigateByUrl(`/login?returnUrl=${returnUrl}`);
      return;
    }

    const pagoPersonalizadoRaw = this.form.value.pagoPersonalizado;
    const pagoPersonalizado: boolean | undefined = pagoPersonalizadoRaw == null
      ? undefined
      : !!pagoPersonalizadoRaw;

    const dtoAny: any = {
      idProgramacionCurso: this.programacionId,
      pagoPersonalizado,
    };

    const payload = this.authService.getTokenPayload();
    if (payload) {
      const possible = payload.id ?? payload.userId ?? payload.usuarioId ?? payload.alumnoId;
      if (possible != null) {
        const asNumber = Number(possible);
        if (!isNaN(asNumber)) dtoAny.idAlumno = asNumber;
      }
    }

    if (dtoAny.idAlumno === undefined) {
      delete dtoAny.idAlumno;
    }

    const dto: MatriculaCreateDTO = dtoAny;

    console.log('MatriculaGeneral.submit -> dto', dto, 'programacionSeleccionada=', this.programacionSeleccionada, 'programacionId=', this.programacionId);

    this.loading.set(true);
      this.matriculaService.crear(dto).subscribe({
        next: (res) => {
          this.loading.set(false);
          this.matriculaCreada.set(true);
          this.matriculaId.set(res.idMatricula);
          this.toast.success('Matrícula creada correctamente.', 5000);
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
}
