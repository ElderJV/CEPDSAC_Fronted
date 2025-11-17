
import { CommonModule } from '@angular/common';
import { Component, HostListener, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CursoDiplomadoService } from '../../core/services/curso-diplomado.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  hasScrolled = signal(false);
  isOffcanvasOpen = signal(false);
  currentView = signal<'main' | 'cursos' | 'diplomados'>('main');

  categoriasCursos: Array<{ id: string; nombre: string }> = [];
  categoriasDiplomados: Array<{ id: string; nombre: string }> = [];

  isHome = false;

  constructor(private router: Router, private cursoDiplomadoService: CursoDiplomadoService) {}

  ngOnInit(): void {
    this.isHome = this.router.url === '/';
    this.cargarCategoriasCursos();
    this.cargarCategoriasDiplomados();
  }

  cargarCategoriasCursos(): void {
    this.cursoDiplomadoService.listarCursos().subscribe({
      next: (cursos) => {
        const categoriasUnicas = new Map<string, string>();
        cursos.forEach(curso => {
          if (curso.categoria) {
            categoriasUnicas.set(curso.categoria.idCategoria.toString(), curso.categoria.nombre);
          }
        });
        this.categoriasCursos = Array.from(categoriasUnicas.entries()).map(([id, nombre]) => ({ id, nombre }));
      }
    });
  }

  cargarCategoriasDiplomados(): void {
    this.cursoDiplomadoService.listarDiplomados().subscribe({
      next: (diplomados) => {
        const categoriasUnicas = new Map<string, string>();
        diplomados.forEach(diplomado => {
          if (diplomado.categoria) {
            categoriasUnicas.set(diplomado.categoria.idCategoria.toString(), diplomado.categoria.nombre);
          }
        });
        this.categoriasDiplomados = Array.from(categoriasUnicas.entries()).map(([id, nombre]) => ({ id, nombre }));
      }
    });
  }

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
