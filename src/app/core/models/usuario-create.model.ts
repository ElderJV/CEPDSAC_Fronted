export type Rol = 'ADMINISTRADOR' | 'ALUMNO' | 'DOCENTE';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface UsuarioCreateDTO {
  rol?: Rol;
  nombre: string;
  apellido?: string;
  correo: string;
  password: string;
  estado?: EstadoUsuario;
  numeroCelular?: string;
  numeroIdentificacion?: string;
  nombrePais?: string;
  idTipoIdentificacion: number;
}
