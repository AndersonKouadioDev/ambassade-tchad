import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/events-data';
import EventDetailHero from '@/components/events/evenement/event-detail-hero';
import EventDetailContent from '@/components/events/evenement/event-detail-content';

interface EventDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <main>
      <EventDetailHero event={event} />
      <EventDetailContent event={event} />
    </main>
  );
}

export async function generateStaticParams() {
  // Cette fonction pourrait être utilisée pour la génération statique
  // Retournons un tableau vide pour l'instant
  return [];
}
