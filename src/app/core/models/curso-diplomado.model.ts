export interface CursoDiplomado {
  idCursoDiplomado: number;
  titulo: string;
  urlCurso: string;
  categoria?: {
    idCategoria: number;
    nombre: string;
    estado: boolean;
  };
  materialesIncluidos?: string;
  requisitos?: string;
}

export interface CursoDiplomadoViewAdmin {
  idCursoDiplomado: number;
  idCategoria: number;
  nombreCategoria: string;
  categoria?: {
    idCategoria: number;
    nombre: string;
    estado: boolean;
  };
  tipo: string; // "CURSO", "DIPLOMADO"
  otorgaCertificado: boolean;
  titulo: string;
  urlCurso: string;
  objetivo: string;
  materialesIncluidos?: string;
  requisitos?: string;
}

export interface ProgramacionCursoSimple {
  idProgramacionCurso: number;
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'VIRTUAL_24_7';
  duracionCurso: number;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  numeroCuotas?: number;
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
  tipo: string; // "CURSO", "DIPLOMADO"s
  otorgaCertificado: boolean;
  titulo: string;
  urlCurso?: string;
  objetivo?: string;
  materialesIncluidos?: string;
  requisitos?: string;
  programaciones: ProgramacionCursoSimple[];
}
