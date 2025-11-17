export interface MatriculaCreateDTO {
  idProgramacionCurso: number;
  pagoPersonalizado?: boolean;
}

export interface MatriculaResponseDTO {
  idMatricula: number;
  estado: string;
  fechaMatricula: string;
  monto: number;
}
