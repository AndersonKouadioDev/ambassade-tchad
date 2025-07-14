import { News } from './types';

// Données temporaires - seront remplacées par des données provenant de l'API
const currentDate = new Date();
const oneDay = 24 * 60 * 60 * 1000; // millisecondes dans un jour

export const newsData: News[] = [
  {
    id: '1',
    title: 'Rencontre avec la communauté tchadienne',
    content: `
      <p>L'Ambassade du Tchad en Côte d'Ivoire a organisé une rencontre importante avec la communauté tchadienne résidant sur le territoire ivoirien. Cette rencontre s'inscrit dans le cadre des efforts continus de l'Ambassade pour maintenir un lien étroit avec ses ressortissants.</p>
      
      <h2>Objectifs de la rencontre</h2>
      <p>Cette rencontre avait pour objectifs principaux :</p>
      <ul>
        <li>Renforcer les liens entre l'Ambassade et la communauté</li>
        <li>Informer sur les services consulaires disponibles</li>
        <li>Recueillir les préoccupations des ressortissants</li>
        <li>Présenter les nouvelles procédures administratives</li>
      </ul>
      
      <h2>Points abordés</h2>
      <p>Durant cette session, plusieurs points importants ont été discutés, notamment les questions relatives aux documents d'identité, aux démarches consulaires et aux opportunités d'investissement au Tchad.</p>
      
      <p>Son Excellence Monsieur l'Ambassadeur a rappelé l'importance pour chaque ressortissant de se faire enregistrer auprès des services consulaires afin de faciliter l'assistance en cas de besoin.</p>
      
      <h2>Prochaines étapes</h2>
      <p>Suite à cette rencontre fructueuse, l'Ambassade a annoncé plusieurs initiatives pour améliorer les services aux ressortissants :</p>
      <ul>
        <li>Organisation de journées consulaires dans différentes villes de Côte d'Ivoire</li>
        <li>Mise en place d'une plateforme numérique pour faciliter les démarches</li>
        <li>Création d'un groupe WhatsApp pour les communications d'urgence</li>
        <li>Organisation de sessions d'information trimestrielles</li>
      </ul>
      
      <p>La prochaine rencontre communautaire est prévue pour le trimestre prochain et sera annoncée sur le site web et les réseaux sociaux de l'Ambassade.</p>
    `,
    imageUrl: '/assets/images/illustrations/page-accueil/cards-1.png',
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(currentDate.getTime() - 5 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 5 * oneDay),
  },
  {
    id: '2',
    title: 'Visite officielle du Ministre des Affaires Étrangères',
    content: `
      <p>Le Ministre des Affaires Étrangères, de l'Intégration Africaine et des Tchadiens de l'Étranger a effectué une visite officielle en Côte d'Ivoire du 25 au 27 février 2024.</p>
      
      <h2>Objectifs de la visite</h2>
      <p>Cette visite s'inscrit dans le cadre du renforcement des relations bilatérales entre le Tchad et la Côte d'Ivoire et avait pour objectifs de :</p>
      <ul>
        <li>Renforcer la coopération économique et culturelle</li>
        <li>Signer des accords de partenariat dans divers domaines</li>
        <li>Préparer la prochaine Commission Mixte de Coopération</li>
        <li>Rencontrer la communauté tchadienne établie en Côte d'Ivoire</li>
      </ul>
      
      <h2>Principales activités</h2>
      <p>Au cours de son séjour, le Ministre a eu des entretiens avec son homologue ivoirien ainsi qu'avec d'autres membres du gouvernement. Il a également rencontré des opérateurs économiques intéressés par des opportunités d'investissement au Tchad.</p>
      
      <p>La délégation ministérielle a visité plusieurs infrastructures économiques et culturelles du pays, notamment le Port Autonome d'Abidjan, considéré comme un modèle de gestion portuaire en Afrique de l'Ouest.</p>
      
      <h2>Résultats de la visite</h2>
      <p>Cette visite a permis de concrétiser plusieurs initiatives, notamment :</p>
      <ul>
        <li>La signature d'un mémorandum d'entente sur la formation diplomatique</li>
        <li>Un accord de coopération dans le domaine agricole</li>
        <li>Un projet d'échange culturel et universitaire</li>
        <li>La création d'un forum économique annuel entre les deux pays</li>
      </ul>
      
      <p>Le Ministre a exprimé sa satisfaction quant aux résultats obtenus et a souligné l'excellence des relations entre le Tchad et la Côte d'Ivoire.</p>
    `,
    imageUrl: '/assets/images/illustrations/page-accueil/cards-2.png',
    published: true,
    authorId: 'admin-2',
    createdAt: new Date(currentDate.getTime() - 15 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 14 * oneDay),
  },
  {
    id: '3',
    title: 'Célébration de la Journée Nationale du Tchad',
    content: `
      <p>L'Ambassade du Tchad en République de Côte d'Ivoire a célébré avec faste la Journée Nationale du Tchad le 11 août dernier, marquant le 63ème anniversaire de l'indépendance du pays.</p>
      
      <h2>Une cérémonie solennelle</h2>
      <p>La cérémonie s'est déroulée à la résidence de l'Ambassade en présence de nombreuses personnalités, notamment :</p>
      <ul>
        <li>Des membres du gouvernement ivoirien</li>
        <li>Des représentants du corps diplomatique</li>
        <li>Des autorités locales</li>
        <li>Des membres de la communauté tchadienne</li>
        <li>Des partenaires économiques et culturels</li>
      </ul>
      
      <h2>Programme des festivités</h2>
      <p>Les célébrations ont débuté par la levée des couleurs nationales, suivie d'une allocution de Son Excellence Monsieur l'Ambassadeur qui a rappelé les liens historiques entre le Tchad et la Côte d'Ivoire, ainsi que les défis et opportunités qui s'offrent à la nation tchadienne.</p>
      
      <p>Un spectacle culturel mettant en valeur la richesse et la diversité du patrimoine tchadien a été présenté, incluant des danses traditionnelles, des chants et une exposition d'artisanat.</p>
      
      <h2>Exposition et dégustation</h2>
      <p>Les invités ont également pu découvrir une exposition photographique retraçant l'histoire du Tchad depuis l'indépendance et apprécier la gastronomie tchadienne lors d'un cocktail dînatoire.</p>
      
      <p>Les invités ont particulièrement apprécié la diversité et l'authenticité des traditions présentées, renforçant ainsi les liens d'amitié et de compréhension mutuelle entre les peuples.</p>
      
      <p>Cette journée a été l'occasion de réaffirmer la volonté du Tchad de consolider ses relations avec la Côte d'Ivoire et de renforcer sa présence sur la scène internationale.</p>
    `,
    imageUrl: '/assets/images/illustrations/page-accueil/cards-3.png',
    published: true,
    authorId: 'admin-1',
    createdAt: new Date(currentDate.getTime() - 25 * oneDay),
    updatedAt: new Date(currentDate.getTime() - 25 * oneDay),
  }
];

// Fonctions utilitaires pour manipuler les données des actualités
export function getAllNews(): News[] {
  return newsData
    .filter(news => news.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getNewsById(id: string): News | undefined {
  return newsData.find(news => news.id === id && news.published);
}

export function getRecentNews(limit?: number): News[] {
  return newsData
    .filter(news => news.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function searchNews(query: string): News[] {
  const searchTerm = query.toLowerCase();
  return newsData
    .filter(news => 
      news.published && (
        news.title.toLowerCase().includes(searchTerm) ||
        news.content.toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getRelatedNews(currentId: string, limit: number = 2): News[] {
  // Simple implementation, in a real app you might use tags or categories to find related news
  return newsData
    .filter(news => news.id !== currentId && news.published)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Formatage des dates pour l'affichage
export function formatNewsDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Fonction pour générer un extrait à partir du contenu HTML
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Supprimer les balises HTML
  const textContent = content.replace(/<[^>]*>/g, ' ');
  // Supprimer les espaces multiples
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  // Limiter la longueur
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength) + '...';
}
