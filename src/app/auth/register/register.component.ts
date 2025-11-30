import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { PaisService, Pais } from '../../core/services/pais.service';
import { TipoIdentificacionService } from '../../core/services/tipo-identificacion.service';
import { environment } from '../../../environment/environment';
import { LucideAngularModule, CheckCircle, XCircle } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RouterLink, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private paisService = inject(PaisService);
  private tipoService = inject(TipoIdentificacionService);
  private platformId = inject(PLATFORM_ID);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    numero_celular: ['', Validators.required],
    numero_identificacion: ['', Validators.required],
    id_codigo_pais: [51],
    id_tipo_identificacion: [1],
  });

  isSubmitting = signal(false);
  showPasswordStrength = signal(false);

  paises: Pais[] = [];
  tiposIdentificacion: Array<{
    idTipoIdentificacion: number;
    nombre?: string;
    iniciales?: string;
  }> = [];

  fieldErrors = signal<{ [key: string]: string }>({});
  generalError = signal<string | null>(null);

  get passwordValue(): string {
    return this.registerForm.get('password')?.value || '';
  }

  hasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  hasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }

  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.passwordValue);
  }

  submit() {
    console.log(
      'Submitting form, valid=',
      this.registerForm.valid,
      'value=',
      this.registerForm.value
    );
    this.fieldErrors.set({});
    this.generalError.set(null);
    this.isSubmitting.set(true);
    const {
      nombre,
      apellido,
      correo,
      password,
      numero_celular,
      numero_identificacion,
      id_tipo_identificacion,
    } = this.registerForm.value;
    const dto = {
      nombre,
      apellido,
      correo,
      password,
      numeroCelular: numero_celular,
      numeroIdentificacion: numero_identificacion,
      nombrePais: null,
      idTipoIdentificacion: id_tipo_identificacion,
    };

    this.auth.register(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.success('Registro exitoso. Por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        const validation = this.errorHandler.getValidationErrors(err) || {};
        console.log(
          'Backend validation errors:',
          validation,
          'raw error:',
          err.error
        );
        this.fieldErrors.set(validation);
        Object.keys(validation).forEach((f) => {
          const control = this.registerForm.get(f);
          if (control) {
            control.setErrors({ server: true });
            control.markAsTouched();
          }
        });
        const msg = this.errorHandler.getErrorMessage(
          err,
          'Error al registrarse'
        );
        this.generalError.set(msg);
        this.toast.error(msg);
      },
    });
  }

  ngOnInit(): void {
    this.loadPaises();
    this.loadTiposIdentificacion();
    this.registerForm.statusChanges?.subscribe((status) => {
      console.log(
        'registerForm.statusChanges ->',
        status,
        'valid=',
        this.registerForm.valid
      );
    });
    if (isPlatformBrowser(this.platformId)) {
      try {
        (window as any).__regComp = this;
      } catch (e) {
        /* ignore */
      }
    }

    this.registerForm.valueChanges?.subscribe(() => {
      const current = { ...this.fieldErrors() };
      Object.keys(current).forEach((k) => {
        const control = this.registerForm.get(k);
        if (control && control.dirty) {
          delete current[k];
          const errs = control.errors || {};
          if (errs['server']) {
            delete errs['server'];
            const hasOther = Object.keys(errs).length > 0;
            control.setErrors(hasOther ? errs : null);
          }
        }
      });
      this.fieldErrors.set(current);
    });
  }

  private loadPaises() {
    console.log('Request: GET', `${environment.apiUrl}/paises`);
    this.paisService.getPaises().subscribe({
      next: (res) => {
        console.log('Response /paises:', res);
        this.paises = res || [];
      },
      error: (err) => {
        console.error('Error loading paises:', err);
        this.paises = [];
        const msg = this.errorHandler.getErrorMessage(
          err,
          'Error cargando países'
        );
        this.toast.error(msg);
      },
    });
  }

  private loadTiposIdentificacion() {
    console.log(
      'Request: GET',
      `${environment.apiUrl}/tipos-identificacion/iniciales`
    );
    this.tipoService.getIniciales().subscribe({
      next: (res) => {
        console.log('Response /tipos-identificacion/iniciales:', res);
        this.tiposIdentificacion = res || [];
      },
      error: (err) => {
        console.error('Error loading tipos-identificacion iniciales:', err);
        this.tiposIdentificacion = [];
        const msg = this.errorHandler.getErrorMessage(
          err,
          'Error cargando tipos de identificación'
        );
        this.toast.error(msg);
      },
    });
  }
}
