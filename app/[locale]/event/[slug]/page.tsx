import EventDetail from "@/features/evenement/components/evenement-details";
import { prefetchEvenementQuery } from "@/features/evenement/queries/evenement-details.query";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = (await params).slug;

  prefetchEvenementQuery(id);

  return (
    <EventDetail id={id} />
  );
}
