"use client";

import { Calendar, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { getAllVideos, searchVideos, filterVideosByDate, extractYoutubeId } from "@/lib/video-store";

export default function VideoGallery() {
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const t = useTranslations("video");
  
  // Récupérer toutes les vidéos
  const allVideos = useMemo(() => getAllVideos(), []);
  
  // Filtrer les vidéos en fonction de la recherche
  const filteredVideos = useMemo(() => {
    if (!search && !searchDate) return allVideos;
    
    let filtered = allVideos;
    
    if (search) {
      filtered = searchVideos(search);
    }
    
    if (searchDate) {
      filtered = filterVideosByDate(searchDate);
    }
    
    return filtered;
  }, [search, searchDate, allVideos]);

  return (
    <section className="px-6 py-12 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-10 font-mulish">
        {t("description")}
      </h2>

        {/* Barres de recherche : Titre + Date */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
        {/* Recherche par titre */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
            aria-label={t("searchByTitle")}
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        {/* Recherche par date */}
        <div className="relative w-full max-w-md">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm appearance-none"
            aria-label={t("searchByDate")}
            title={t("searchByDate")}
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => {
            const youtubeId = extractYoutubeId(video.youtubeUrl);
            return (
              <div
                key={video.id}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={video.title || "Vidéo de l'ambassade"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </div>
                <div className="bg-card p-4">
                  <h3 className="text-center text-sm font-semibold text-gray-800 mb-2">
                    {video.title || t("untitled")}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-gray-600 text-center">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-gray-600">
              {t("noVideos")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
