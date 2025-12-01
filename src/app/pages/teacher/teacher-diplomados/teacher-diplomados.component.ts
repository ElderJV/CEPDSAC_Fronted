import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomadoViewAdmin } from '../../../core/models/curso-diplomado.model';
import { LucideAngularModule, GraduationCap, Users, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-teacher-diplomados',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './teacher-diplomados.component.html',
  styleUrl: './teacher-diplomados.component.css'
})
export class TeacherDiplomadosComponent implements OnInit {
  private cursoService = inject(CursoDiplomadoService);

  diplomados = signal<CursoDiplomadoViewAdmin[]>([]);
  loading = signal(true);

  readonly GraduationCap = GraduationCap;
  readonly Users = Users;
  readonly BookOpen = BookOpen;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading.set(true);
    this.cursoService.listarDiplomadosDocente().subscribe({
      next: (data) => {
        this.diplomados.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar diplomados del docente', err);
        this.loading.set(false);
      }
    });
  }
}
