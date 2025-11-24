import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ConfiguracionGeneral } from '../models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGeneralService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/configuracion/general`;

  obtener(): Observable<ConfiguracionGeneral> {
    return this.http.get<ConfiguracionGeneral>(this.apiUrl);
  }

  actualizar(configuracion: ConfiguracionGeneral): Observable<ConfiguracionGeneral> {
    return this.http.put<ConfiguracionGeneral>(this.apiUrl, configuracion);
  }
}
