import { Video } from './types';

/**
 * Récupérer tous les vidéos du store
 */
export function getAllVideos(): Video[] {
  return videoGalleryData;
}

/**
 * Recherche des vidéos basée sur le titre ou la description
 */
export function searchVideos(query: string): Video[] {
  const lowerQuery = query.toLowerCase();
  return videoGalleryData.filter(video =>
    (video.title && video.title.toLowerCase().includes(lowerQuery)) ||
    (video.description && video.description.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filtre les vidéos par date
 */
export function filterVideosByDate(date: string): Video[] {
  if (!date) return videoGalleryData;
  
  const filterDate = new Date(date);
  return videoGalleryData.filter(video => {
    const videoDate = new Date(video.createdAt);
    return videoDate.getFullYear() === filterDate.getFullYear() && 
           videoDate.getMonth() === filterDate.getMonth() && 
           videoDate.getDate() === filterDate.getDate();
  });
}

/**
 * Extrait l'ID YouTube d'une URL YouTube complète
 */
export function extractYoutubeId(url: string): string {
  if (!url) return '';
  
  // Pattern pour extraire l'ID YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11)
    ? match[2]
    : url;
}

// Données temporaires - seront remplacées par des données provenant de l'API
export const videoGalleryData: Video[] = [
  {
    id: '1',
    title: "Message de vœux de l'Ambassadeur",
    description: "Allocution de Son Excellence l'Ambassadeur à l'occasion du Nouvel An",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: "Présentation des services consulaires",
    description: "Guide vidéo expliquant les démarches consulaires disponibles à l'Ambassade",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '3',
    title: "Tchad : Terre d'opportunités",
    description: "Présentation des opportunités d'investissement au Tchad",
    youtubeUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '4',
    title: "Danses traditionnelles tchadiennes",
    description: "Spectacle de danses traditionnelles lors de la Journée Nationale",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  },
  {
    id: '5',
    title: "Interview : La diplomatie économique tchadienne",
    description: "Entretien avec le Conseiller économique de l'Ambassade sur les relations Tchad-Côte d'Ivoire",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20')
  },
  {
    id: '6',
    title: "Reportage : La communauté tchadienne en Côte d'Ivoire",
    description: "Présentation de la diaspora tchadienne et de son intégration",
    youtubeUrl: "https://www.youtube.com/watch?v=1UQzJfsT2eo",
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15')
  }
];
