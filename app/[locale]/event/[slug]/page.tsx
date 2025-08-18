import EventDetailContent from "@/features/evenement/components/evenement-details/event-detail-content";
import { prefetchEvenementQuery } from "@/features/evenement/queries/evenement-details.query";
import EventDetailHero from "@/features/evenement/components/evenement-details/event-detail-hero";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = (await params).slug;

  prefetchEvenementQuery(id);

  return (
    <main>
      <EventDetailHero />
      <EventDetailContent />
    </main>
  );
}
