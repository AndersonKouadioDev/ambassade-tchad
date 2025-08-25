import GaleryPhotos from "@/features/photos/components/index";
import Hero from "@/components/events/galerie_photos/hero";
import { prefetchPhotosList } from "@/features/photos/queries/photo-list.query";

export default async function galeryPhotos() {
  const params = {
    title: "",
    createdAt: "",
    page: 1,
    limit: 12,
    // published: true,
  };

  // Prefetch côté serveur
  await prefetchPhotosList(params);

  return (
    <div>
      <Hero />
      <GaleryPhotos searchParams={params} />
    </div>
  );
}
