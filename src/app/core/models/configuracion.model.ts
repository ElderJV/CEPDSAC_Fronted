export interface MetodoPago {
  idMetodoPago: number;
  tipoMetodo: string; // YAPE PLIN TRANSFERENCIA
  descripcion?: string;
  requisitos?: string;
  imagenQR?: string;
  activo: boolean;
}

export interface MetodoPagoRequestDTO {
  tipoMetodo: string; // YAPE PLIN TRANSFERENCIA
  descripcion: string;
  requisitos: string;
  imagenQR?: string;
  activo?: boolean;
}

export interface ConfiguracionGeneral {
  numeroEstudiantes: number;
  numeroCertificaciones: number;
  numeroInstructores: number;
  numeroCursos: number;
}

export interface ConfiguracionContacto {
  correoContacto: string;
  telefono: string;
  whatsapp?: string;
  direccion?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ConfiguracionSEO {
  tituloSitio: string;
  descripcionMeta: string;
  keywords: string;
  imagenOG?: string;
}
