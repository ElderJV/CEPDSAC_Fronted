export interface ProgramacionCursoResponse {
    idProgramacionCurso: number;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
    nombreCursoDiplomado: string;
    nombreDocente: string;
    cantidadInscritos: number;
    duracionMeses: number;
    activo?: boolean;
    modalidad?: string;
    idCursoDiplomado?: number;
    idDocente?: number;
}