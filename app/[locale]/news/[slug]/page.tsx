import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsDetailHero from '@/components/events/news/news-detail-hero';
import NewsDetailContent from '@/components/events/news/news-detail-content';
import { getNewsBySlug } from '@/lib/news-data';

type Props = {
  params: {
    locale: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = getNewsBySlug(params.slug);
  
  if (!news) {
    return {
      title: 'Actualité non trouvée - Ambassade du Tchad',
    };
  }

  return {
    title: `${news.title} - Ambassade du Tchad`,
    description: news.excerpt,
    keywords: `actualité, ambassade tchad, ${news.tags.join(', ')}`,
  };
}

export default function NewsDetailPage({ params }: Props) {
  const news = getNewsBySlug(params.slug);

  if (!news) {
    notFound();
  }

  return (
    <div>
      <NewsDetailHero news={news} />
      <NewsDetailContent news={news} />
    </div>
  );
}
