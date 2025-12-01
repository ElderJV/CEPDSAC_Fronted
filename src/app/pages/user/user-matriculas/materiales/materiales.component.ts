import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatriculaService } from '../../../../core/services/matricula.service';
import { MatriculaDetalleResponse } from '../../../../core/models/matricula.model';

// Interfaz simple para simular materiales (luego vendrá de tu BD)
interface MaterialDidactico {
  titulo: string;
  recursos: {
    tipo: 'PDF' | 'VIDEO' | 'ENLACE' | 'EXAMEN';
    nombre: string;
    url: string;
  }[];
}

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materiales.component.html',
  styleUrl: './materiales.component.css',
})
export class MaterialesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private matriculaService = inject(MatriculaService);
  private location = inject(Location); // Para el botón volver

  matriculaId: number = 0;
  cursoInfo: MatriculaDetalleResponse | null = null;
  isLoading = true;

  // Datos simulados (Mock) para el diseño
  modulos: MaterialDidactico[] = [
    {
      titulo: 'Módulo 1: Introducción y Fundamentos',
      recursos: [
        { tipo: 'PDF', nombre: 'Diapositivas de la clase 1', url: '#' },
        { tipo: 'VIDEO', nombre: 'Grabación de la sesión en vivo', url: '#' },
        {
          tipo: 'ENLACE',
          nombre: 'Lectura complementaria: Documentación oficial',
          url: '#',
        },
      ],
    },
    {
      titulo: 'Módulo 2: Estructuras Avanzadas',
      recursos: [
        { tipo: 'PDF', nombre: 'Guía de ejercicios prácticos', url: '#' },
        {
          tipo: 'VIDEO',
          nombre: 'Tutorial: Implementación de patrones',
          url: '#',
        },
      ],
    },
    {
      titulo: 'Evaluación Parcial',
      recursos: [
        { tipo: 'EXAMEN', nombre: 'Examen teórico M1 y M2', url: '#' },
      ],
    },
  ];

  ngOnInit(): void {
    // 1. Obtener el ID de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.matriculaId = +id;
        this.cargarInfoCurso();
      }
    });
  }

  cargarInfoCurso() {
    this.matriculaService.obtenerDetalleCompleto(this.matriculaId).subscribe({
      next: (data) => {
        this.cursoInfo = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.location.back();
  }

  // Método auxiliar para el ícono según tipo
  getIcono(tipo: string): string {
    switch (tipo) {
      case 'PDF':
        return 'bi-file-earmark-pdf';
      case 'VIDEO':
        return 'bi-play-circle';
      case 'ENLACE':
        return 'bi-link-45deg';
      case 'EXAMEN':
        return 'bi-pencil-square';
      default:
        return 'bi-file-earmark';
    }
  }

  // Color del ícono
  getColor(tipo: string): string {
    switch (tipo) {
      case 'PDF':
        return 'text-danger'; // Rojo
      case 'VIDEO':
        return 'text-primary'; // Azul
      case 'ENLACE':
        return 'text-info'; // Celeste
      case 'EXAMEN':
        return 'text-warning'; // Amarillo
      default:
        return 'text-secondary';
    }
  }
}
