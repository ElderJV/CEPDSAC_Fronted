import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);
  private toastService = inject(ToastService);

  private authSvc = this.authService; // alias local para usar en el modal

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  errorMessage: string | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired'] === 'true') {
        this.toastService.error(
          'Tiempo en sesión expiró, loguearse nuevamente'
        );
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Introduce un correo y una contraseña validos.';
      return;
    }
    this.isSubmitting = true;

    const { correo, password } = this.loginForm.value;

    this.authService.login(correo, password).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response?.token) {
          // Guardar el Token
          this.authService.setToken(response.token);

          // Guardar el rol
          if ((response as any).rol) {
            this.authService.setRole((response as any).rol);
          }

          // Guardar el ID del usuario
          if (response.user && response.user.idUsuario) {
            this.authService.setUserId(response.user.idUsuario);
          }
          // Nota: A veces viene como 'id' en lugar de 'idUsuario', revisa tu consola
          else if (response.user && (response.user as any).id) {
            this.authService.setUserId((response.user as any).id);
          }

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          try {
            if (returnUrl) {
              // si hay returnUrl, respetarlo
              this.router.navigateByUrl(returnUrl);
            } else {
              // redirigir según rol recibido (ADMINISTRADOR -> /admin, en otro caso -> /)
              const rol = (response as any).rol ?? this.authService.getRole();
              if (rol && String(rol).toUpperCase().includes('ADMIN')) {
                this.router.navigate(['/admin']);
              } else if (rol && String(rol).toUpperCase().includes('ALUMNO')) {
                this.router.navigate(['/user']);
              } else {
                this.router.navigate(['/']);
              }
            }
          } catch (e) {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage = 'No se recibio el jwt';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Error en login:', err);
        // usar el servicio centralizado de errores en el service
        this.errorMessage = this.errorHandler.getErrorMessage(
          err,
          'Error al iniciar sesión. Intenta nuevamente.'
        );
      },
    });
  }

  async openForgotPassword(event: Event): Promise<void> {
    event.preventDefault();
    const currentEmail = this.loginForm.get('correo')?.value || '';

    const result = await Swal.fire<string>({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Introduce tu correo',
      inputValue: currentEmail,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF4D00',
      cancelButtonColor: '#010102ff',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        input: 'custom-swal-input',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage('El correo es requerido');
          return;
        }
        try {
          // convertir Observable a Promise
          await lastValueFrom(this.authSvc.forgotPassword(value));
          return value;
        } catch (err: any) {
          const msg =
            err?.error?.mensaje ??
            err?.message ??
            'Error al enviar la solicitud';
          Swal.showValidationMessage(msg);
          throw err;
        }
      },
    });

    if (result && result.value) {
      Swal.fire({
        icon: 'success',
        iconColor: '#FF4D00',
        title: 'Enviado',
        text: 'Verificado, recibirás un email con instrucciones, Por favor verificalo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#FF4D00',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-confirm',
        },
      });
    }
  }
}
