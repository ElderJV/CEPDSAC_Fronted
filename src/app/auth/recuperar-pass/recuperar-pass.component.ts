import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors,} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-recuperar-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.css'],
})
export class RecuperarPassComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private errorHandler = inject(ErrorHandlerService);

  resetForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;
  token: string | null = null;
  showPasswordStrength = false; 

  constructor() {
    this.resetForm = this.fb.group(
      {
        nuevaPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            this.passwordStrengthValidator,
          ],
        ],
        confirmarPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    // cap token
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      Swal.fire({icon: 'error',
        title: 'Token inválido',
        text: 'No se proporcionó un token válido. Por favor, solicita un nuevo enlace de recuperación.',
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);
    const valid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('nuevaPassword');
    const confirmPassword = control.get('confirmarPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.resetForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }
    if (!this.token) {
      this.errorMessage = 'Token inválido. Por favor, solicita un nuevo enlace.';
      return;
    }
    this.isSubmitting = true;
    const { nuevaPassword } = this.resetForm.value;

    this.authService.resetPassword(this.token, nuevaPassword).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Contraseña restablecida!',
          text: 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
          confirmButtonText: 'Ir al login',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Error al restablecer contraseña:', err);
        this.errorMessage = this.errorHandler.getErrorMessage(
          err,
          'Error al restablecer la contraseña. El token puede ser inválido o haber expirado.'
        );
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
      },
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  get passwordsMismatch(): boolean {
    return !!(
      this.resetForm.hasError('passwordsMismatch') &&
      this.resetForm.get('confirmarPassword')?.touched
    );
  }

  get currentPassword(): string {
    return this.resetForm.get('nuevaPassword')?.value || '';
  }

  get hasMinLength(): boolean {
    return this.currentPassword.length >= 8;
  }

  get hasMaxLength(): boolean {
    return this.currentPassword.length <= 128;
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.currentPassword);
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.currentPassword);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.currentPassword);
  }

  get hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.currentPassword);
  }
}
