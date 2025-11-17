import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Usuario } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  //Listamos a todos los usuarios
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`);
  }

  //Listamos usuarios por su rol
    listarPorRol(rol: 'ALUMNO' | 'DOCENTE'): Observable<Usuario[]> {
      console.info('UsuariosService.listarPorRol -> rol:', rol);
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar/${rol}`);
    }
}
