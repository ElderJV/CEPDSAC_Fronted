import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TestimoniosModel, TestimonioItem } from '../../../core/models/testimonios.model';
import { TESTIMONIOS_DATA } from '../../../core/data/testimonios.data';
import { TestimonioService } from '../../../core/services/testimonio.service';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css',
})
export class TestimoniosComponent implements OnInit {
  private testimonioService = inject(TestimonioService);
  
  displayTestimonios = signal<TestimonioItem[]>([]);

  ngOnInit(): void {
    this.testimonioService.obtenerTodos().subscribe({
      next: (data) => {
        console.log('Testimonios raw data:', data);
        
        const approved = data.filter(t => t.estadoAprobado);
        console.log('Approved testimonials:', approved);

        const mappedTestimonios: TestimonioItem[] = approved
          .map(t => {
            const nombre = t.idUsuario?.nombre || 'Usuario';
            const apellido = t.idUsuario?.apellido || 'Desconocido';
            return {
              quote: t.comentario,
              author: `${nombre} ${apellido}`,
              role: 'Estudiante',
              course: 'Curso/Diplomado',
              avatar: 'assets/images/avatars/default-avatar.png' 
            };
          });

        if (mappedTestimonios.length > 0) {
          this.displayTestimonios.set(mappedTestimonios);
        } else {
          console.warn('No approved testimonials found, using default data.');
          this.useDefaultData();
        }
      },
      error: (err) => {
        console.error('Error loading testimonials', err);
        this.useDefaultData();
      }
    });
  }

  private useDefaultData() {
    this.displayTestimonios.set(TESTIMONIOS_DATA.testimonio);
  }
}
