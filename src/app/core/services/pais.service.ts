import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Pais {
  idPais: number;
  nombre: string;
  codigo: string | null;
}

@Injectable({ providedIn: 'root' })
export class PaisService {
  constructor(private http: HttpClient) {}

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${environment.apiUrl}/paises`);
  }
}
