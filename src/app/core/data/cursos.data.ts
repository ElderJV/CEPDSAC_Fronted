import { CursosModel } from '../models/cursos.model';

export const CURSOS_DATA: CursosModel = {
  categorias: [
    {
      id: 'tecnologia',
      name: 'Tecnología',
      description: 'Cursos relacionados con desarrollo y software',
    },
    {
      id: 'negocios',
      name: 'Negocios',
      description: 'Cursos sobre finanzas, marketing y emprendimiento',
    },
    {
      id: 'productividad',
      name: 'Productividad',
      description: 'Mejora tus habilidades y eficiencia personal',
    },
    {
      id: 'gestion',
      name: 'Gestión',
      description: 'Aprende liderazgo y administración efectiva',
    },
  ],
  cursos: [
    {
      title: 'Aplicaciones Móviles',
      imgSrc: 'curso1.png',
      categoria: 'Tecnología',
    },
    {
      title: 'Inteligencia Artificial',
      imgSrc: 'https://placehold.co/600x400/475569/FFFFFF?text=IA',
      categoria: 'Tecnología',
    },
    {
      title: 'Ciberseguridad',
      imgSrc: 'https://placehold.co/600x400/64748B/FFFFFF?text=Seguridad',
      categoria: 'Tecnología',
    },

    {
      title: 'Marketing Digital',
      imgSrc: 'https://placehold.co/600x400/0F766E/FFFFFF?text=Marketing',
      categoria: 'Negocios',
    },
    {
      title: 'Finanzas',
      imgSrc: 'https://placehold.co/600x400/134E4A/FFFFFF?text=Finanzas',
      categoria: 'Negocios',
    },

    {
      title: 'Gestión del Tiempo',
      imgSrc: 'https://placehold.co/600x400/BE123C/FFFFFF?text=Tiempo',
      categoria: 'Productividad',
    },
    {
      title: 'Metodologías Ágiles',
      imgSrc: 'https://placehold.co/600x400/9F1239/FFFFFF?text=Agile',
      categoria: 'Productividad',
    },

    {
      title: 'Liderazgo',
      imgSrc: 'https://placehold.co/600x400/7E22CE/FFFFFF?text=Lider',
      categoria: 'Gestión',
    },
    {
      title: 'Recursos Humanos',
      imgSrc: 'https://placehold.co/600x400/6B21A8/FFFFFF?text=RRHH',
      categoria: 'Gestión',
    },
  ],
};
