import { DiplomadosModel } from '../models/diplomados.model';

export const DIPLOMADOS_DATA: DiplomadosModel = {
  categorias: [
    {
      id: 'diplomados-educacion',
      name: 'Educación',
    },
    {
      id: 'diplomados-ingenieria',
      name: 'Ingeniería',
    },
    {
      id: 'diplomados-salud',
      name: 'Salud',
    },
    {
      id: 'diplomados-direccionygerencia',
      name: 'Dirección y Gerencia',
    },
  ],

  diplomados: [
    // Diplomados de Educación
    {
      title: 'Alta Gerencia',
      imgSrc: 'https://placehold.co/600x400/9A3412/FFFFFF?text=Gerencia',
      categoria: 'Educación',
    },
    {
      title: 'Gestión del Talento',
      imgSrc: 'https://placehold.co/600x400/7C2D12/FFFFFF?text=Talento',
      categoria: 'Educación',
    },
    {
      title: 'Gerencia',
      imgSrc: 'https://placehold.co/600x400/9A3412/FFFFFF?text=Gerencia',
      categoria: 'Educación',
    },
    {
      title: 'Talento',
      imgSrc: 'https://placehold.co/600x400/7C2D12/FFFFFF?text=Talento',
      categoria: 'Educación',
    },

    // Diplomados de Ingeniería
    {
      title: 'Arquitectura Cloud',
      imgSrc: 'https://placehold.co/600x400/1E40AF/FFFFFF?text=Cloud',
      categoria: 'Ingeniería',
    },
    {
      title: 'Big Data & Analytics',
      imgSrc: 'https://placehold.co/600x400/1E3A8A/FFFFFF?text=Big+Data',
      categoria: 'Ingeniería',
    },
    {
      title: 'Cloud',
      imgSrc: 'https://placehold.co/600x400/1E40AF/FFFFFF?text=Cloud',
      categoria: 'Ingeniería',
    },
    {
      title: 'Big Data',
      imgSrc: 'https://placehold.co/600x400/1E3A8A/FFFFFF?text=Big+Data',
      categoria: 'Ingeniería',
    },

    // Diplomados de Salud
    {
      title: 'Comunicación Corporativa',
      imgSrc: 'https://placehold.co/600x400/4D7C0F/FFFFFF?text=Prensa',
      categoria: 'Salud',
    },
    {
      title: 'Marketing Político',
      imgSrc: 'https://placehold.co/600x400/3F6212/FFFFFF?text=Política',
      categoria: 'Salud',
    },
    {
      title: 'Enfermería',
      imgSrc: 'https://placehold.co/600x400/4D7C0F/FFFFFF?text=Prensa',
      categoria: 'Salud',
    },
    {
      title: 'Telemedicina',
      imgSrc: 'https://placehold.co/600x400/3F6212/FFFFFF?text=Política',
      categoria: 'Salud',
    },

    // Diplomados de Dirección y Gerencia
    {
      title: 'Alta Dirección',
      imgSrc: 'https://placehold.co/600x400/9A3412/FFFFFF?text=Alta+Dirección',
      categoria: 'Dirección y Gerencia',
    },
    {
      title: 'Gestión Estratégica',
      imgSrc:
        'https://placehold.co/600x400/7C2D12/FFFFFF?text=Gestión+Estratégica',
      categoria: 'Dirección y Gerencia',
    },
    {
      title: 'Transformación Digital',
      imgSrc:
        'https://placehold.co/600x400/9A3412/FFFFFF?text=Transformación+Digital',
      categoria: 'Dirección y Gerencia',
    },
    {
      title: 'Gobierno Corporativo',
      imgSrc:
        'https://placehold.co/600x400/7C2D12/FFFFFF?text=Gobierno+Corporativo',
      categoria: 'Dirección y Gerencia',
    },
  ],
};
