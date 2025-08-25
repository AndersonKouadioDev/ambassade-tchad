"use client";

import { Search, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { videoFiltersClient } from "@/features/videos/filters/video.filters";
import { useVideosList } from "@/features/videos/queries/video-list.query";
import { DotLoader } from "react-spinners";
import {
  IVideo,
  IVideoRechercheParams,
} from "@/features/videos/types/video.type";

interface Props {
  searchParams: IVideoRechercheParams;
}

export default function VideoGallery({ searchParams }: Props) {
  const t = useTranslations("gallery.video");

  const [filters, setFilters] = useQueryStates(
    videoFiltersClient.filter,
    videoFiltersClient.option
  );

  const currentSearchParams = {
    page: filters.page,
    limit: filters.limit,
    title: filters.title,
    createdAt: filters.createdAt,
  };

  const { data, isLoading, isError } = useVideosList(currentSearchParams);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, title: e.target.value, page: 1 });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, createdAt: e.target.value, page: 1 });
  };


  const videos = data ?? [];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("description")}
        </h2>

        {/* Filtres de recherche */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filters.title || ""}
              onChange={handleTitleChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm"
            />
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="date"
              value={filters.createdAt || ""}
              onChange={handleDateChange}
              className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm appearance-none"
              aria-label={t("searchByDate")}
              title={t("searchByDate")}
            />
            <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Grille des vidéos */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
            {videos.map((video: IVideo) => (
              <div
                key={video.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group h-full"
              >
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeUrl}?rel=0`}
                    title={video.title || t("untitled")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                    {video.title || t("untitled")}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 col-span-full">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {t("noVideos")}
            </h3>
            <p className="text-gray-500">{t("noVideosDescription")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
