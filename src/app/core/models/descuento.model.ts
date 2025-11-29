export interface Descuento {
  idDescuento: number;
  tipoDescuento: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  vigente: boolean;
  fechaInicio: string;
  fechaFin: string;
}

export interface DescuentoCreateDTO {
  tipoDescuento: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  vigente: boolean;
  fechaInicio: string;
  fechaFin: string;
}

export interface DescuentoUpdateDTO extends DescuentoCreateDTO {
  idDescuento: number;
}

export interface DescuentoAplicacion {
  idDescuentoAplicacion: number;
  tipoAplicacion: 'CATEGORIA' | 'CURSO' | 'MATRICULA';
  idDescuento: number;
  infoDescuento: string;
  idCategoria?: number;
  nombreCategoria?: string;
  idCursoDiplomado?: number;
  tituloCursoDiplomado?: string;
  idMatricula?: number;
}

export interface DescuentoAplicacionCreateDTO {
  tipoAplicacion: 'CATEGORIA' | 'CURSO' | 'MATRICULA';
  idDescuento: number;
  idCategoria?: number;
  idCursoDiplomado?: number;
  idMatricula?: number;
}
