export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: 'ALUMNO' | 'DOCENTE';
    activo: boolean;
    inicialesTipoIdentificacion: string;
    numeroIdentificacion: string;
}