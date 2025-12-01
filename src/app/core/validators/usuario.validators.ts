import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class UsuarioValidators {
  
  static nombre(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      return regex.test(control.value) ? null : { nombreInvalido: true };
    };
  }

  static apellido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      return regex.test(control.value) ? null : { apellidoInvalido: true };
    };
  }

  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*/;
      return regex.test(control.value) ? null : { passwordDebil: true };
    };
  }

  static numeroCelular(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /^[+]?[0-9\s\-()]{7,15}$/;
      return regex.test(control.value) ? null : { celularInvalido: true };
    };
  }

  static numeroIdentificacion(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /^[0-9]+$/;
      return regex.test(control.value) ? null : { identificacionInvalida: true };
    };
  }
}

export const USUARIO_ERROR_MESSAGES = {
  nombre: {
    required: 'El nombre es obligatorio',
    minlength: 'El nombre debe tener al menos 2 caracteres',
    maxlength: 'El nombre no puede exceder 50 caracteres',
    nombreInvalido: 'El nombre solo puede contener letras y espacios'
  },
  apellido: {
    maxlength: 'El apellido no puede exceder 50 caracteres',
    apellidoInvalido: 'El apellido solo puede contener letras y espacios'
  },
  correo: {
    required: 'El correo es obligatorio',
    email: 'Formato de correo electrónico inválido',
    maxlength: 'El correo no puede exceder 255 caracteres'
  },
  password: {
    required: 'La contraseña es obligatoria',
    minlength: 'La contraseña debe tener al menos 8 caracteres',
    maxlength: 'La contraseña no puede exceder 128 caracteres',
    passwordDebil: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)'
  },
  numeroCelular: {
    maxlength: 'El número celular no puede exceder 15 caracteres',
    celularInvalido: 'Formato de número celular inválido'
  },
  numeroIdentificacion: {
    maxlength: 'El número de identificación no puede exceder 20 caracteres',
    identificacionInvalida: 'El número de identificación solo puede contener dígitos'
  },
  nombrePais: {
    maxlength: 'El nombre del país no puede exceder 50 caracteres'
  },
  idTipoIdentificacion: {
    required: 'El tipo de identificación es obligatorio'
  }
};
