export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  numeroCelular?: string;
  numeroIdentificacion?: string;
  rol: 'ALUMNO' | 'DOCENTE' | 'ADMINISTRADOR';
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}

export interface Testimonio {
  idTestimonio: number;
  comentario: string;
  estadoAprobado: boolean | null;
  idUsuario: Usuario;
}

export interface TestimonioListDTO {
  idTestimonio: number;
  comentario: string;
  estadoAprobado: boolean | null;
  nombreUsuario: string;
  apellidoUsuario: string;
  correoUsuario: string;
}
