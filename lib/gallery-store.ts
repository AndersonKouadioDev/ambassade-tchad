import { Photo, Video } from './types';

// Données temporaires - seront remplacées par des données provenant de l'API
export const photoGalleryData: Photo[] = [
  {
    id: '1',
    title: "Façade de l'Ambassade du Tchad",
    description: "Vue extérieure du bâtiment principal de l'Ambassade du Tchad en Côte d'Ivoire",
    imageUrl: "/assets/images/illustrations/ambassade/card_1.png",
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: '2',
    title: "Réception officielle",
    description: "Son Excellence l'Ambassadeur lors d'une réception officielle",
    imageUrl: "/assets/images/illustrations/ambassade/card_2.png",
    createdAt: new Date('2023-07-22'),
    updatedAt: new Date('2023-07-22')
  },
  {
    id: '3',
    title: "Drapeau national",
    description: "Le drapeau de la République du Tchad flottant devant l'Ambassade",
    imageUrl: "/assets/images/illustrations/ambassade/card_3.png",
    createdAt: new Date('2023-08-11'),
    updatedAt: new Date('2023-08-11')
  },
  {
    id: '4',
    title: "Journée portes ouvertes",
    description: "Visiteurs découvrant la culture tchadienne lors de la journée portes ouvertes",
    imageUrl: "/assets/images/illustrations/ambassade/card_4.png",
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-09-05')
  },
  {
    id: '5',
    title: "Rencontre diplomatique",
    description: "Échange entre diplomates tchadiens et ivoiriens",
    imageUrl: "/assets/images/illustrations/page-accueil/cards-1.png",
    createdAt: new Date('2023-10-18'),
    updatedAt: new Date('2023-10-18')
  },
  {
    id: '6',
    title: "Exposition culturelle",
    description: "Présentation d'objets d'art traditionnel tchadien",
    imageUrl: "/assets/images/illustrations/page-accueil/cards-2.png",
    createdAt: new Date('2023-11-30'),
    updatedAt: new Date('2023-11-30')
  },
  {
    id: '7',
    title: "Conférence internationale",
    description: "Participation de la délégation tchadienne à une conférence internationale",
    imageUrl: "/assets/images/illustrations/page-accueil/cards-3.png",
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '8',
    title: "Cérémonie de remise de distinction",
    description: "Son Excellence l'Ambassadeur recevant une distinction honorifique",
    imageUrl: "/assets/images/illustrations/ambassade/card_1.png",
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28')
  }
];

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
    createdAt: new Date('2023-08-11'),
    updatedAt: new Date('2023-08-11')
  },
  {
    id: '5',
    title: "Interview : Le Tchad et la CEDEAO",
    description: "Entretien avec un expert sur les relations entre le Tchad et la CEDEAO",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    createdAt: new Date('2023-11-25'),
    updatedAt: new Date('2023-11-25')
  }
];

// Fonctions utilitaires pour la galerie photos
export function getAllPhotos(): Photo[] {
  return photoGalleryData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getPhotoById(id: string): Photo | undefined {
  return photoGalleryData.find(photo => photo.id === id);
}

export function searchPhotos(query: string): Photo[] {
  const searchTerm = query.toLowerCase();
  return photoGalleryData
    .filter(photo => 
      (photo.title && photo.title.toLowerCase().includes(searchTerm)) || 
      (photo.description && photo.description.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Fonctions utilitaires pour la galerie vidéos
export function getAllVideos(): Video[] {
  return videoGalleryData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getVideoById(id: string): Video | undefined {
  return videoGalleryData.find(video => video.id === id);
}

export function searchVideos(query: string): Video[] {
  const searchTerm = query.toLowerCase();
  return videoGalleryData
    .filter(video => 
      (video.title && video.title.toLowerCase().includes(searchTerm)) || 
      (video.description && video.description.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube à partir de son URL
export function getYouTubeVideoId(url: string): string | null {
  const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regex);
  return (match && match[2].length === 11) ? match[2] : null;
}
