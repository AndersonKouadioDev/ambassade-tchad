

/**
 * Formate la date d'une actualité en format local
 */
export function formatNewsDate(date: Date | string): string {
  const newsDate = new Date(date);
  return newsDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
