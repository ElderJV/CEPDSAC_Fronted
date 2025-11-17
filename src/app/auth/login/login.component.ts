import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  errorMessage: string | null = null;
  isSubmitting = false;

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
          localStorage.setItem('jwt_token', response.token);
          this.router.navigate(['/dashboard']);
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
      }
    });
  }
}
