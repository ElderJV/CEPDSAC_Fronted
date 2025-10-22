import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error en login:', err);
        this.errorMessage = this.getErrorMessage(err);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) return 'Credenciales erroneas.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    return 'Intenta nuevamente.';
  }
}