import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ConfiguracionGeneralService } from '../../../core/services/configuracion-general.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit {
  private configService = inject(ConfiguracionGeneralService);

  metrics = {
    estudiantes: 0,
    certificaciones: 0,
    instructores: 0,
    cursos: 0
  };

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.configService.obtener().subscribe({
      next: (config) => {
        this.metrics = {
          estudiantes: config.numeroEstudiantes || 0,
          certificaciones: config.numeroCertificaciones || 0,
          instructores: config.numeroInstructores || 0,
          cursos: config.numeroCursos || 0
        };
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
      }
    });
  }
}
