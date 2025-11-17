import { Component } from '@angular/core';
import { SearchBarAdminComponent } from "../../../components/search-bar-admin/search-bar-admin.component";
import { DataTableAdminComponent } from "../../../components/data-table-admin/data-table-admin.component";
import { CursoDiplomadoService } from '../../../core/services/curso-diplomado.service';
import { CursoDiplomado } from '../../../core/models/curso-diplomado.model';

@Component({
  selector: 'app-admin-cursos',
  imports: [SearchBarAdminComponent, DataTableAdminComponent],
  templateUrl: './admin-cursos.component.html',
  styleUrls: ['../../admin/admin-styles.css','./admin-cursos.component.css']
})
export class AdminCursosComponent {
  cursos: CursoDiplomado[] = [];

  constructor(private cursosService: CursoDiplomadoService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursosService.listar().subscribe({
      //filtramos solo los cursos
      next: (data) => this.cursos = data.filter(curso => curso.tipo != 'DIPLOMADO'),
      error: (err) => console.error('Error cargando cursos', err)
    });
  }
  
}
