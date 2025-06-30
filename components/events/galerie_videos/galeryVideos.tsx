"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";


type Video = {
  title: string;
  youtubeId: string; // just the video ID, not full URL
};

export default function VideoGallery() {
  const [search, setSearch] = useState("");
  const t = useTranslations("video");

  const videos: Video[] = [
    { title: t("videos.0"), youtubeId: "dQw4w9WgXcQ" },
    { title: t("videos.1"), youtubeId: "kJQP7kiw5Fk" },
    { title: t("videos.2"), youtubeId: "3JZ_D3ELwOQ" },
  ];

    const filteredNews = videos.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="px-6 py-12 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-10 font-mulish">
        {t("description")}
      </h2>

       {/* Barre de recherche */}
        <div className="relative max-w-md mx-auto w-full mb-20">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video.youtubeId}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
            <div className="bg-card p-4 text-center text-sm font-semibold text-gray-700">
              {video.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
