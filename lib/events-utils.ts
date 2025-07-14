import { Event } from './types';

// Utilitaires pour les événements

/**
 * Formate la date d'un événement en format local
 */
export function formatEventDate(date: Date | string): string {
  const eventDate = new Date(date);
  return eventDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Vérifie si un événement est à venir
 */
export function isEventUpcoming(date: Date | string): boolean {
  const eventDate = new Date(date);
  const today = new Date();
  return eventDate >= today;
}

/**
 * Vérifie si un événement est passé
 */
export function isEventPast(date: Date | string): boolean {
  return !isEventUpcoming(date);
}

/**
 * Recherche des événements basée sur le titre ou la description
 */
export function searchEvents(events: Event[], query: string): Event[] {
  const lowerQuery = query.toLowerCase();
  return events.filter(event =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery) ||
    (event.location && event.location.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filtre les événements par date
 */
export function filterEventsByDate(events: Event[], date: string): Event[] {
  if (!date) return events;
  
  const filterDate = new Date(date);
  return events.filter(event => {
    const eventDate = new Date(event.eventDate);
    return (
      eventDate.getFullYear() === filterDate.getFullYear() &&
      eventDate.getMonth() === filterDate.getMonth() &&
      eventDate.getDate() === filterDate.getDate()
    );
  });
}

/**
 * Filtre les événements par statut (à venir ou passés)
 */
export function filterEventsByStatus(events: Event[], status: 'all' | 'upcoming' | 'past'): Event[] {
  if (status === 'all') return events;
  return status === 'upcoming' 
    ? events.filter(event => isEventUpcoming(event.eventDate))
    : events.filter(event => isEventPast(event.eventDate));
}

/**
 * Trie les événements par date (croissant ou décroissant)
 */
export function sortEventsByDate(events: Event[], order: 'asc' | 'desc' = 'asc'): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}
