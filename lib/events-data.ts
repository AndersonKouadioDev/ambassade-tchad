export interface Event {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  image: string;
  category: 'conference' | 'ceremony' | 'meeting' | 'cultural' | 'other';
  featured: boolean;
  tags: string[];
  organizer: string;
  capacity?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export const eventsData: Event[] = [
  {
    id: '1',
    title: 'Cérémonie de Commémoration de l\'Indépendance du Tchad',
    slug: 'ceremonie-commemoration-independance-tchad-2024',
    excerpt: 'Célébration solennelle du 64ème anniversaire de l\'indépendance de la République du Tchad avec la communauté tchadienne de Côte d\'Ivoire.',
    content: `
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
    date: '2024-08-11',
    time: '09:00',
    location: 'Ambassade du Tchad, Abidjan-Cocody',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
    category: 'ceremony',
    featured: true,
    tags: ['indépendance', 'cérémonie', 'culture', 'diplomatie'],
    organizer: 'Ambassade du Tchad en Côte d\'Ivoire',
    capacity: 200,
    registrationRequired: true,
    registrationDeadline: '2024-08-09',
    contactEmail: 'contact@ambassadetchadci.org',
    contactPhone: '+225 27 22 44 13 64'
  },
  {
    id: '2',
    title: 'Forum Économique Tchad-Côte d\'Ivoire',
    slug: 'forum-economique-tchad-cote-ivoire-2024',
    excerpt: 'Rencontre d\'affaires entre les opérateurs économiques tchadiens et ivoiriens pour renforcer les échanges commerciaux.',
    content: `
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
    date: '2024-09-15',
    time: '08:30',
    location: 'Hôtel Ivoire, Abidjan-Cocody',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
    category: 'conference',
    featured: true,
    tags: ['économie', 'investissement', 'commerce', 'partenariat'],
    organizer: 'Ambassade du Tchad & Chambre de Commerce CI',
    capacity: 150,
    registrationRequired: true,
    registrationDeadline: '2024-09-10',
    contactEmail: 'economie@ambassadetchadci.org',
    contactPhone: '+225 27 22 44 13 65'
  },
  {
    id: '3',
    title: 'Soirée Culturelle Tchadienne',
    slug: 'soiree-culturelle-tchadienne-2024',
    excerpt: 'Une soirée dédiée à la découverte de la richesse culturelle du Tchad à travers la musique, la danse et la gastronomie.',
    content: `
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
    date: '2024-10-05',
    time: '18:00',
    location: 'Centre Culturel d\'Abidjan, Plateau',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
    category: 'cultural',
    featured: false,
    tags: ['culture', 'musique', 'danse', 'gastronomie', 'tradition'],
    organizer: 'Ambassade du Tchad & Association Culturelle Tchadienne',
    registrationRequired: false,
    contactEmail: 'culture@ambassadetchadci.org'
  },
  {
    id: '4',
    title: 'Réunion Consulaire - Services aux Citoyens',
    slug: 'reunion-consulaire-services-citoyens-2024',
    excerpt: 'Réunion d\'information sur les services consulaires et les nouvelles procédures administratives.',
    content: `
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
    date: '2024-11-20',
    time: '14:00',
    location: 'Ambassade du Tchad, Salle de Conférence',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
    category: 'meeting',
    featured: false,
    tags: ['consulaire', 'administration', 'passeport', 'légalisation'],
    organizer: 'Service Consulaire - Ambassade du Tchad',
    capacity: 80,
    registrationRequired: true,
    registrationDeadline: '2024-11-18',
    contactEmail: 'consulaire@ambassadetchadci.org',
    contactPhone: '+225 27 22 44 13 66'
  },
  {
    id: '5',
    title: 'Conférence sur l\'Investissement au Tchad',
    slug: 'conference-investissement-tchad-2024',
    excerpt: 'Présentation des opportunités d\'investissement au Tchad dans le cadre de la Vision 2030.',
    content: `
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
    date: '2024-12-10',
    time: '09:00',
    location: 'Hôtel Pullman, Abidjan-Plateau',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
    category: 'conference',
    featured: true,
    tags: ['investissement', 'économie', 'vision2030', 'développement'],
    organizer: 'Ambassade du Tchad & API-Tchad',
    capacity: 120,
    registrationRequired: true,
    registrationDeadline: '2024-12-07',
    contactEmail: 'investissement@ambassadetchadci.org',
    contactPhone: '+225 27 22 44 13 67'
  }
];

// Fonctions utilitaires
export function getAllEvents(): Event[] {
  return eventsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedEvents(): Event[] {
  return eventsData.filter(event => event.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventBySlug(slug: string): Event | undefined {
  return eventsData.find(event => event.slug === slug);
}

export function getEventsByCategory(category: Event['category']): Event[] {
  return eventsData.filter(event => event.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUpcomingEvents(): Event[] {
  const today = new Date();
  return eventsData.filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(): Event[] {
  const today = new Date();
  return eventsData.filter(event => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function searchEvents(query: string): Event[] {
  const searchTerm = query.toLowerCase();
  return eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm) ||
    event.excerpt.toLowerCase().includes(searchTerm) ||
    event.content.toLowerCase().includes(searchTerm) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    event.location.toLowerCase().includes(searchTerm)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function filterEventsByDate(date: string): Event[] {
  return eventsData.filter(event => event.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getPreviousEvent(currentSlug: string): Event | undefined {
  const currentIndex = eventsData.findIndex(event => event.slug === currentSlug);
  if (currentIndex > 0) {
    return eventsData[currentIndex - 1];
  }
  return undefined;
}

export function getNextEvent(currentSlug: string): Event | undefined {
  const currentIndex = eventsData.findIndex(event => event.slug === currentSlug);
  if (currentIndex >= 0 && currentIndex < eventsData.length - 1) {
    return eventsData[currentIndex + 1];
  }
  return undefined;
}

export function getRelatedEvents(currentSlug: string, limit: number = 3): Event[] {
  const currentEvent = getEventBySlug(currentSlug);
  if (!currentEvent) return [];

  return eventsData
    .filter(event =>
      event.slug !== currentSlug &&
      (event.category === currentEvent.category ||
        event.tags.some(tag => currentEvent.tags.includes(tag)))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isEventUpcoming(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

export function getCategoryColor(category: Event['category']): string {
  const colors = {
    conference: 'bg-blue-100 text-blue-800',
    ceremony: 'bg-purple-100 text-purple-800',
    meeting: 'bg-green-100 text-green-800',
    cultural: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };
  return colors[category] || colors.other;
}

export function getCategoryLabel(category: Event['category']): string {
  const labels = {
    conference: 'Conférence',
    ceremony: 'Cérémonie',
    meeting: 'Réunion',
    cultural: 'Culturel',
    other: 'Autre'
  };
  return labels[category] || labels.other;
}
