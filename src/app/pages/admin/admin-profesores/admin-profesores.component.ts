import { Component } from '@angular/core';
import { SearchBarAdminComponent } from "../../../components/search-bar-admin/search-bar-admin.component";
import { DataTableAdminComponent } from "../../../components/data-table-admin/data-table-admin.component";
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuarios.model';

@Component({
  selector: 'app-admin-profesores',
  imports: [SearchBarAdminComponent, DataTableAdminComponent],
  templateUrl: './admin-profesores.component.html',
  styleUrls: ['../../admin/admin-styles.css','./admin-profesores.component.css']
  
})
export class AdminProfesoresComponent {
  profesores: Usuario[] = [];
  
    constructor(private usuariosService: UsuariosService) {}
  
    ngOnInit(): void {
      this.cargarProfesores();
    }
  
    cargarProfesores() {
      this.usuariosService.listarPorRol('DOCENTE').subscribe({
        next: (data) => this.profesores = data,
        error: (err) => console.error('Error cargando profesores', err)
      });
    }
}
