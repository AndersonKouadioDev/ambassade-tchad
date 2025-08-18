import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetailHero from "@/components/events/news/news-detail-hero";
import NewsDetailContent from "@/components/events/news/news-detail-content";
import { getNewsBySlug } from "@/lib/news-data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const news = getNewsBySlug(id);

  if (!news) {
    return {
      title: "Actualité non trouvée - Ambassade du Tchad",
    };
  }

  return {
    title: `${news.title} - Ambassade du Tchad`,
    description: news.excerpt,
    keywords: `actualité, ambassade tchad, ${news.tags.join(", ")}`,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  const news = getNewsBySlug(id);

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
