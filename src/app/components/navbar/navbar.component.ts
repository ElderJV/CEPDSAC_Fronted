import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Scroll dinámico para el background del navbar
  hasScrolled = signal(false);

  // Estado reactivo con señales de Angular
  // isOffcanvasOpen indica si el menú offcanvas está abierto (true/false)
  isOffcanvasOpen = signal(false);

  // currentView guarda en qué vista estamos dentro del menú:
  // 'main' = menú principal, 'cursos' = vista de cursos, 'diplomados' = vista de diplomados
  currentView = signal<'main' | 'cursos' | 'diplomados'>('main');

  // Se activa cada vez que se hace scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 50;
    if (this.hasScrolled() !== isScrolled) {
      this.hasScrolled.set(isScrolled);
    }
  }

  // Alterna entre abrir/cerrar el offcanvas
  toggleOffcanvas(): void {
    if (this.isOffcanvasOpen()) {
      this.closeOffcanvas();
    } else {
      this.openOffcanvas();
    }
  }

  // Abre el offcanvas
  openOffcanvas(): void {
    this.isOffcanvasOpen.set(true); // Cambiamos el estado a "abierto"
    this.currentView.set('main'); // Al abrir, siempre inicia en la vista principal
    document.body.style.overflow = 'hidden'; // Bloquea el scroll del body
  }

  // Cierra el offcanvas
  closeOffcanvas(): void {
    this.isOffcanvasOpen.set(false); // Cambiamos el estado a "cerrado"
    document.body.style.overflow = 'auto'; // Habilitamos scroll del body
    // Espera 300ms (tiempo de animación) antes de resetear la vista a "main"
    setTimeout(() => this.currentView.set('main'), 300);
  }

  // Cambia a la vista que se indique (main, cursos o diplomados)
  setView(view: 'main' | 'cursos' | 'diplomados'): void {
    this.currentView.set(view);
  }

  // Regresa a la vista principal "main"
  goBack(): void {
    this.currentView.set('main');
  }
}
