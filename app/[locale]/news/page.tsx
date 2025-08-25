import Hero from '@/components/events/news/hero';
import News from '@/features/actualites/components/actualite-list-table/news';
import { prefetchActualitesList } from '@/features/actualites/queries/actualite-list.query';

export default async function NewsPage() {

  // ⚡ Préparer les paramètres de recherche par défaut
  const params = {
    title: '',
    content: '',
    page: 1,
    limit: 12,
    // published: true,
  };

  // Prefetch côté serveur
  await prefetchActualitesList(params);

  return (
    <div>
      <Hero />
      <News searchParams={params} />
    </div>
  );
}
