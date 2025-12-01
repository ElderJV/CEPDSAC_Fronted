export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    password?: string;
    rol: 'ALUMNO' | 'DOCENTE' | 'ADMINISTRADOR';
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    inicialesTipoIdentificacion: string;
    idTipoIdentificacion?: number;
    numeroIdentificacion: string;
    numeroCelular?: string;
    nombrePais?: string;
    id_codigo_pais?: number;
}

export interface UsuarioToggle {
    idUsuario: number;
    estado: 'ACTIVO' | 'INACTIVO';
}