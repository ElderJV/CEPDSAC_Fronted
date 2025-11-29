export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface CategoriaCreateDTO {
  nombre: string;
  descripcion?: string;
}
