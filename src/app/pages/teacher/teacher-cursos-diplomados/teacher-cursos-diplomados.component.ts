import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomadoViewAdmin } from '../../../core/models/curso-diplomado.model';
import { LucideAngularModule, BookOpen, GraduationCap, Calendar, Users } from 'lucide-angular';

@Component({
  selector: 'app-teacher-cursos-diplomados',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './teacher-cursos-diplomados.component.html',
  styleUrl: './teacher-cursos-diplomados.component.css'
})
export class TeacherCursosComponent implements OnInit {
  private cursoService = inject(CursoDiplomadoService);

  cursos = signal<CursoDiplomadoViewAdmin[]>([]);
  loading = signal(true);

  readonly BookOpen = BookOpen;
  readonly GraduationCap = GraduationCap;
  readonly Calendar = Calendar;
  readonly Users = Users;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading.set(true);
    this.cursoService.listarCursosDocente().subscribe({
      next: (data) => {
        this.cursos.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar cursos del docente', err);
        this.loading.set(false);
      }
    });
  }
}
