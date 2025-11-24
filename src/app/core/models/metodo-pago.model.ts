export interface MetodoPago {
  idMetodoPago: number;
  tipoMetodo: string;
  descripcion: string;
  requisitos?: string;
  imagenQR: string;
  activo: boolean;
}
