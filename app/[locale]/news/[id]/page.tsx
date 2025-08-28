import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActualitesDetailAction } from "@/features/actualites/actions/actualites.action";
import { prefetchActualiteDetailQuery } from "@/features/actualites/queries/actualite-details.query";
import ActualiteDetail from "@/features/actualites/components/actualite-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getActualitesDetailAction(id);

  if (!result.success) {
    return {
      title: "Actualité non trouvée - Ambassade du Tchad",
    };
  }

  return {
    title: `${result.data?.title} - Ambassade du Tchad`,
    description: result.data?.content,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }
  await prefetchActualiteDetailQuery(id);
  return <ActualiteDetail id={id} />;
}
