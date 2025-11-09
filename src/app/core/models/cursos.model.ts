export interface Categoria {
  id: string;
  name: string;
  description?: string;
}

export interface CursoItem {
  title: string;
  imgSrc: string;
  categoria: string;
}

export interface CursosModel {
  categorias: Categoria[];
  cursos: CursoItem[];
}
