import { Event } from './types';

// Données temporaires - seront remplacées par des données provenant de l'API
const currentDate = new Date();
const oneDay = 24 * 60 * 60 * 1000; // millisecondes dans un jour

export const eventsData: Event[] = [
  {
    id: '1',
    title: "Cérémonie de Commémoration de l'Indépendance du Tchad",
    description: `
      <p>L'Ambassade du Tchad en République de Côte d'Ivoire a l'honneur d'inviter toute la communauté tchadienne et les amis du Tchad à la cérémonie de commémoration du 64ème anniversaire de l'indépendance de la République du Tchad.</p>
      <h3>Programme de la cérémonie</h3>
      <ul>
        <li>09h00 - Accueil des invités</li>
        <li>09h30 - Levée des couleurs nationales</li>
        <li>10h00 - Discours de Son Excellence l'Ambassadeur</li>
        <li>10h30 - Présentation culturelle</li>
        <li>11h00 - Cocktail et échanges</li>
      </ul>
      <h3>Invités d'honneur</h3>
      <p>La cérémonie sera honorée par la présence de personnalités ivoiriennes et de représentants du corps diplomatique accrédité en Côte d'Ivoire.</p>
      <h3>Dress code</h3>
      <p>Tenue de cérémonie exigée. Les tenues traditionnelles tchadiennes sont vivement encouragées.</p>
    `,
    eventDate: new Date(currentDate.getTime() + 30 * oneDay), // 30 jours dans le futur
    location: 'Ambassade du Tchad, Abidjan-Cocody',
    imageUrl: '/assets/images/illustrations/page-accueil/cards-1.png',
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(currentDate.getTime() - 5 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 5 * oneDay)
  },
  {
    id: '2',
    title: "Forum Économique Tchad-Côte d'Ivoire",
    description: `
      <p>Le Forum Économique Tchad-Côte d'Ivoire 2024 réunira les acteurs économiques des deux pays pour explorer de nouvelles opportunités de coopération et d'investissement.</p>
      <h3>Objectifs du forum</h3>
      <ul>
        <li>Promouvoir les échanges commerciaux bilatéraux</li>
        <li>Identifier les opportunités d'investissement</li>
        <li>Faciliter les partenariats public-privé</li>
        <li>Présenter les réformes économiques en cours</li>
      </ul>
      <h3>Secteurs prioritaires</h3>
      <ul>
        <li>Agriculture et agro-industrie</li>
        <li>Mines et hydrocarbures</li>
        <li>Infrastructure et BTP</li>
        <li>Technologies de l'information</li>
        <li>Tourisme et hôtellerie</li>
      </ul>
      <h3>Participants attendus</h3>
      <p>Plus de 150 entrepreneurs, investisseurs et décideurs politiques des deux pays sont attendus à cet événement majeur.</p>
    `,
    eventDate: new Date(currentDate.getTime() + 45 * oneDay), // 45 jours dans le futur
    location: 'Hôtel Ivoire, Abidjan-Cocody',
    imageUrl: '/assets/images/illustrations/page-accueil/cards-2.png',
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(currentDate.getTime() - 10 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 10 * oneDay)
  },
  {
    id: '3',
    title: 'Soirée Culturelle Tchadienne',
    description: `
      <p>Venez découvrir la richesse et la diversité de la culture tchadienne lors d'une soirée exceptionnelle mêlant traditions et modernité.</p>
      <h3>Au programme</h3>
      <ul>
        <li>Spectacles de danses traditionnelles</li>
        <li>Concert de musique tchadienne</li>
        <li>Dégustation de plats traditionnels</li>
        <li>Exposition d'artisanat local</li>
        <li>Contes et légendes du Tchad</li>
      </ul>
      <h3>Artistes invités</h3>
      <p>La soirée sera animée par des artistes tchadiens renommés, résidant en Côte d'Ivoire et venus spécialement du Tchad pour l'occasion.</p>
      <h3>Informations pratiques</h3>
      <p>Entrée libre. Tenues traditionnelles bienvenues. Parking disponible sur site.</p>
    `,
    eventDate: new Date(currentDate.getTime() + 15 * oneDay), // 15 jours dans le futur
    location: "Centre Culturel d'Abidjan, Plateau",
    imageUrl: '/assets/images/illustrations/page-accueil/cards-3.png',
    published: true,
    authorId: 'admin-2',
    createdAt: new Date(currentDate.getTime() - 3 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 3 * oneDay)
  },
  {
    id: '4',
    title: 'Réunion Consulaire - Services aux Citoyens',
    description: `
      <p>L'Ambassade organise une réunion d'information destinée à la communauté tchadienne pour présenter les nouveaux services consulaires et les procédures administratives.</p>
      <h3>Sujets abordés</h3>
      <ul>
        <li>Délivrance des passeports biométriques</li>
        <li>Procédures de légalisation</li>
        <li>Services d'état civil</li>
        <li>Assistance aux citoyens en difficulté</li>
        <li>Nouvelles modalités de prise de rendez-vous</li>
      </ul>
      <h3>Documents à présenter</h3>
      <p>Nous encourageons les participants à apporter leurs documents d'identité pour bénéficier de conseils personnalisés.</p>
      <h3>Séance de questions-réponses</h3>
      <p>Une séance interactive permettra de répondre à toutes vos questions concernant les services consulaires.</p>
    `,
    eventDate: new Date(currentDate.getTime() + 10 * oneDay), // 10 jours dans le futur
    location: 'Ambassade du Tchad, Salle de Conférence',
    imageUrl: '/assets/images/illustrations/page-accueil/cards-1.png',
    published: true,
    authorId: 'admin-3',
    createdAt: new Date(currentDate.getTime() - 7 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 5 * oneDay)
  },
  {
    id: '5',
    title: "Conférence sur l'Investissement au Tchad",
    description: `
      <p>Cette conférence présentera les nombreuses opportunités d'investissement au Tchad dans le cadre du programme "Vision 2030, le Tchad que nous voulons".</p>
      <h3>Secteurs porteurs</h3>
      <ul>
        <li>Agriculture et élevage</li>
        <li>Mines et géologie</li>
        <li>Pétrole et énergies renouvelables</li>
        <li>Infrastructures et transport</li>
        <li>Télécommunications</li>
        <li>Tourisme et hôtellerie</li>
      </ul>
      <h3>Avantages compétitifs</h3>
      <ul>
        <li>Position géographique stratégique</li>
        <li>Richesses naturelles diversifiées</li>
        <li>Stabilité politique</li>
        <li>Réformes économiques en cours</li>
        <li>Incitations fiscales attractives</li>
      </ul>
      <h3>Intervenants</h3>
      <p>Des experts économiques, des représentants du gouvernement tchadien et des investisseurs expérimentés partageront leur expertise.</p>
    `,
    eventDate: new Date(currentDate.getTime() + 60 * oneDay), // 60 jours dans le futur
    location: 'Hôtel Pullman, Abidjan-Plateau',
    imageUrl: '/assets/images/illustrations/page-accueil/cards-2.png',
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(currentDate.getTime() - 15 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 12 * oneDay)
  }
];

// Fonctions utilitaires pour manipuler les données des événements
export function getAllEvents(): Event[] {
  return eventsData
    .filter(event => event.published)
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
}

export function getEventById(id: string): Event | undefined {
  return eventsData.find(event => event.id === id && event.published);
}

export function getUpcomingEvents(limit?: number): Event[] {
  const now = new Date();
  return eventsData
    .filter(event => event.published && event.eventDate > now)
    .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
    .slice(0, limit);
}

export function getPastEvents(limit?: number): Event[] {
  const now = new Date();
  return eventsData
    .filter(event => event.published && event.eventDate <= now)
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime())
    .slice(0, limit);
}

export function searchEvents(query: string): Event[] {
  const searchTerm = query.toLowerCase();
  return eventsData
    .filter(event => 
      event.published && (
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        (event.location && event.location.toLowerCase().includes(searchTerm))
      )
    )
    .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
}

// Formatage des dates pour l'affichage
export function formatEventDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isEventUpcoming(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

// Fonction pour générer un slug à partir d'un titre
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
