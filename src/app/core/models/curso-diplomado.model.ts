export interface CursoDiplomado {
  idCursoDiplomado: number;
  titulo: string;
  urlCurso: string;
  categoria?: {
    idCategoria: number;
    nombre: string;
  };
}

export interface CursoDiplomadoViewAdmin{
  idCursoDiplomado: number;
  idCategoria: number;
  nombreCategoria: string;
  tipo: string; // "CURSO" o "DIPLOMADO"
  otorgaCertificado: boolean;
  titulo: string;
  urlCurso: string;
  objetivo: string;
}

export interface ProgramacionCursoSimple {
  idProgramacionCurso: number;
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'VIRTUAL_24_7';
  duracionCurso: number;
  horasSemanales: number;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  duracionMeses?: number;
  horario?: string;
  idDocente?: number;
  nombreDocente?: string;
  apellidoDocente?: string;
}

export interface CursoDetalle {
  idCursoDiplomado: number;
  idCategoria?: number;
  nombreCategoria?: string;
  tipo: boolean; // false: CURSO, true: DIPLOMADO
  otorgaCertificado: boolean;
  titulo: string;
  urlCurso?: string;
  objetivo?: string;
  materialesIncluidos?: string;
  requisitos?: string;
  programaciones: ProgramacionCursoSimple[];
}
