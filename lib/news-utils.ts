import { News } from './types';

// Utilitaires pour les actualités

/**
 * Formate la date d'une actualité en format local
 */
export function formatNewsDate(date: Date | string): string {
  const newsDate = new Date(date);
  return newsDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Recherche des actualités basée sur le titre ou le contenu
 */
export function searchNews(news: News[], query: string): News[] {
  const lowerQuery = query.toLowerCase();
  return news.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.content.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filtre les actualités par date
 */
export function filterNewsByDate(news: News[], date: string): News[] {
  if (!date) return news;
  
  const filterDate = new Date(date);
  return news.filter(item => {
    const newsDate = new Date(item.createdAt);
    return (
      newsDate.getFullYear() === filterDate.getFullYear() &&
      newsDate.getMonth() === filterDate.getMonth() &&
      newsDate.getDate() === filterDate.getDate()
    );
  });
}

/**
 * Trie les actualités par date (croissant ou décroissant)
 */
export function sortNewsByDate(news: News[], order: 'asc' | 'desc' = 'desc'): News[] {
  return [...news].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Obtient un extrait du contenu HTML
 */
export function getNewsExcerpt(content: string, maxLength: number = 150): string {
  // Supprimer les balises HTML
  const textContent = content.replace(/<[^>]*>/g, '');
  // Tronquer le texte
  return textContent.length > maxLength
    ? `${textContent.substring(0, maxLength)}...`
    : textContent;
}
