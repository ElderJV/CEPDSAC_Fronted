import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

//servicio de notificaciones usando sweetalert2
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  success(message: string, duration: number = 3000): void {
    this.showToast('success', message, duration);
  }

  error(message: string, duration: number = 5000): void {
    this.showToast('error', message, duration);
  }

  warning(message: string, duration: number = 4000): void {
    this.showToast('warning', message, duration);
  }

  info(message: string, duration: number = 3000): void {
    this.showToast('info', message, duration);
  }

  //muestra modal de confirmaciON
  async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }

  private showToast(icon: 'success' | 'error' | 'warning' | 'info', message: string, duration: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon,
      title: message
    });
  }
}
