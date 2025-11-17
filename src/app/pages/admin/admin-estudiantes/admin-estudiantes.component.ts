import { Component } from '@angular/core';
import { SearchBarAdminComponent } from "../../../components/search-bar-admin/search-bar-admin.component";
import { DataTableAdminComponent } from "../../../components/data-table-admin/data-table-admin.component";
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuarios.model';

@Component({
  selector: 'app-admin-estudiantes',
  imports: [SearchBarAdminComponent, DataTableAdminComponent],
  templateUrl: './admin-estudiantes.component.html',
  styleUrls: ['../../admin/admin-styles.css','./admin-estudiantes.component.css']
})
export class AdminEstudiantesComponent {
  estudiantes: Usuario[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.usuariosService.listarPorRol('ALUMNO').subscribe({
      next: (data) => this.estudiantes = data,
      error: (err) => console.error('Error cargando estudiantes', err)
    });
  }
}
