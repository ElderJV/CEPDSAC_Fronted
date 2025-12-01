export interface MatriculaCreateDTO {
  idProgramacionCurso: number;
  idAlumno?: number;
  pagoPersonalizado?: boolean;
}

export interface MatriculaResponseDTO {
  idMatricula: number;
  estado: string;
  fechaMatricula: string;
  monto: number;
  alumnoNombre?: string;
}

// detalle completo de matrícula
export interface MatriculaDetalleResponse {
  idMatricula: number;
  estado: string;
  fechaMatricula: string;
  montoBase: number;
  montoDescontado: number;
  monto: number;
  alumno: {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    activo: boolean;
    inicialesTipoIdentificacion: string;
    numeroIdentificacion: string;
  };
  cursoDiplomado: {
    idCursoDiplomado: number;
    idCategoria: number;
    nombreCategoria: string;
    tipo: string;
    otorgaCertificado: boolean;
    titulo: string;
    urlCurso: string;
    objetivo: string;
  };
  descuento?: {
    idDescuento: number;
    tipoDescuento: string;
    valor: number;
    vigente: boolean;
    fechaInicio: string;
    fechaFin: string;
  };
  pagos: PagoResponse[];
}

// response pago
export interface PagoResponse {
  idPago: number;
  monto: number;
  numeroCuota: number;
  fechaPago?: string;
  metodoPagoDescripcion?: string;
  tipoMetodo?: string;
  fechaVencimiento?: string;
  estadoCuota: 'PENDIENTE' | 'PAGADO' | 'VENCIDA';
  montoPagado?: number;
  esAutomatico?: boolean;
  numeroOperacion?: string;
  observaciones?: string;
}

// dtocreate pago
export interface PagoCreateDTO {
  idMatricula: number;
  idMetodoPago: number;
  monto?: number;
  numeroOperacion?: string;
  observaciones?: string;
  fechaPago?: string;
}

// enum para estados de matricual
export enum EstadoMatricula {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  PAGADO = 'PAGADO',
  CANCELADO = 'CANCELADO'
}

// interfaz para items de la lista de matriuclas en vista admin
export interface MatriculaAdminListItem {
  idMatricula: number;
  nombreCompletoAlumno: string;
  dniAlumno: string;
  correoAlumno: string;
  tituloCurso: string;
  fechaMatricula: string;
  estado: EstadoMatricula;
  monto: number;
  cuotasPagadas: number;
  totalCuotas: number;
  proximoVencimiento?: string;
  tieneVencidas: boolean;
}

// constante para mapeo de estados a clases CSS de badges
export const ESTADO_BADGE_CLASSES: Record<EstadoMatricula, string> = {
  [EstadoMatricula.PENDIENTE]: 'badge-warning',
  [EstadoMatricula.EN_PROCESO]: 'badge-info',
  [EstadoMatricula.PAGADO]: 'badge-success',
  [EstadoMatricula.CANCELADO]: 'badge-danger'
};

export interface MatriculaListResponse {
  idMatricula: number;
  nombreCompletoAlumno: string;
  dniAlumno: string;
  correoAlumno: string;
  tituloCurso: string;
  fechaMatricula: string;
  estado: EstadoMatricula;
  monto: number;
  cuotasPagadas: number;
  totalCuotas: number;
  proximoVencimiento?: string;
  tieneVencidas: boolean;
}
