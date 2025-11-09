export interface Categoria {
  id: string;
  name: string;
  description?: string;
}

export interface DiplomadoItem {
  title: string;
  imgSrc: string;
  categoria: string;
}

export interface DiplomadosModel {
  categorias: Categoria[];
  diplomados: DiplomadoItem[];
}
