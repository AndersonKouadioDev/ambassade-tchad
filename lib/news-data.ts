export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
  tags: string[];
};

export const newsData: NewsItem[] = [
  {
    id: 1,
    slug: 'rencontre-communaute-tchadienne',
    title: 'Rencontre avec la communauté tchadienne',
    date: '2024-03-15',
    dateFormatted: '15 Mars 2024',
    author: 'Service Communication',
    category: 'Communauté',
    excerpt: 'Une rencontre importante avec les ressortissants tchadiens résidant en Côte d\'Ivoire pour renforcer les liens avec l\'Ambassade.',
    image: '/assets/images/illustrations/page-accueil/cards-1.png',
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
      
      <p>L'Ambassadeur a également présenté la <strong>vision 2030</strong> du gouvernement tchadien et les opportunités qu'elle offre à la diaspora.</p>
      
      <h2>Prochaines étapes</h2>
      <p>Suite à cette rencontre fructueuse, l'Ambassade s'engage à organiser des sessions régulières d'information et à améliorer continuellement ses services pour mieux servir la communauté tchadienne.</p>
    `,
    tags: ['Communauté', 'Diaspora', 'Services Consulaires']
  },
  {
    id: 2,
    slug: 'visite-officielle-president',
    title: 'Visite officielle renforçant les relations bilatérales',
    date: '2024-03-10',
    dateFormatted: '10 Mars 2024',
    author: 'Cabinet de l\'Ambassadeur',
    category: 'Diplomatie',
    excerpt: 'Visite officielle importante renforçant les relations entre le Tchad et la Côte d\'Ivoire dans plusieurs domaines stratégiques.',
    image: '/assets/images/illustrations/page-accueil/cards-2.png',
    content: `
      <p>Dans le cadre du renforcement des relations diplomatiques entre la République du Tchad et la République de Côte d'Ivoire, une visite officielle de haut niveau s'est tenue récemment à Abidjan.</p>
      
      <h2>Contexte de la visite</h2>
      <p>Cette visite s'inscrit dans la continuité des excellentes relations qui unissent les deux pays frères, partenaires dans de nombreux domaines de coopération depuis des décennies.</p>
      
      <h2>Thèmes abordés</h2>
      <p>Les discussions de haut niveau ont porté sur plusieurs axes stratégiques :</p>
      <ul>
        <li>La coopération économique et commerciale</li>
        <li>Les questions de sécurité régionale</li>
        <li>Les échanges culturels et éducatifs</li>
        <li>Les projets d'infrastructure transfrontaliers</li>
        <li>La coopération dans le secteur énergétique</li>
      </ul>
      
      <h2>Accords signés</h2>
      <p>Cette rencontre a été marquée par la signature de plusieurs accords de coopération qui ouvrent de nouvelles perspectives pour les deux nations.</p>
      
      <p>Les dirigeants ont également réaffirmé leur engagement commun pour la paix et la stabilité dans la sous-région ouest-africaine.</p>
    `,
    tags: ['Diplomatie', 'Coopération', 'Relations Bilatérales', 'Économie']
  },
  {
    id: 3,
    slug: 'reception-ambassade-tchad',
    title: 'Grande réception diplomatique à l\'Ambassade',
    date: '2024-03-05',
    dateFormatted: '05 Mars 2024',
    author: 'Service Protocole',
    category: 'Événement',
    excerpt: 'Grande réception organisée par l\'Ambassade pour célébrer les relations Tchad-Côte d\'Ivoire et promouvoir les échanges culturels.',
    image: '/assets/images/illustrations/page-accueil/cards-3.png',
    content: `
      <p>L'Ambassade du Tchad en Côte d'Ivoire a organisé une grande réception en l'honneur des partenaires et amis des deux pays, dans les jardins de la résidence de l'Ambassadeur.</p>
      
      <h2>Un événement fédérateur</h2>
      <p>Cette réception exceptionnelle a rassemblé plus de 200 personnalités du monde diplomatique, économique, culturel et politique des deux pays.</p>
      
      <h2>Moments forts de la soirée</h2>
      <p>L'événement a été marqué par plusieurs temps forts :</p>
      <ul>
        <li>Allocutions officielles de l'Ambassadeur et des invités d'honneur</li>
        <li>Performances artistiques traditionnelles tchadiennes</li>
        <li>Exposition de produits artisanaux et gastronomiques du Tchad</li>
        <li>Démonstrations culturelles et danses folkloriques</li>
        <li>Dégustation de spécialités culinaires tchadiennes</li>
      </ul>
      
      <h2>Promotion du patrimoine culturel</h2>
      <p>Cette soirée a été l'occasion de faire découvrir la richesse du patrimoine culturel tchadien à travers différentes expressions artistiques et culinaires.</p>
      
      <p>Les invités ont particulièrement apprécié la diversité et l'authenticité des traditions présentées, renforçant ainsi les liens d'amitié et de compréhension mutuelle entre les peuples.</p>
    `,
    tags: ['Événement', 'Culture', 'Partenariat', 'Tradition']
  }
];

export function getNewsById(id: number): NewsItem | undefined {
  return newsData.find(news => news.id === id);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsData.find(news => news.slug === slug);
}

export function getRelatedNews(currentId: number, limit: number = 2): NewsItem[] {
  return newsData.filter(news => news.id !== currentId).slice(0, limit);
}

export function getPreviousNews(currentId: number): NewsItem | undefined {
  const currentIndex = newsData.findIndex(news => news.id === currentId);
  if (currentIndex > 0) {
    return newsData[currentIndex - 1];
  }
  return undefined;
}

export function getNextNews(currentId: number): NewsItem | undefined {
  const currentIndex = newsData.findIndex(news => news.id === currentId);
  if (currentIndex < newsData.length - 1) {
    return newsData[currentIndex + 1];
  }
  return undefined;
}
