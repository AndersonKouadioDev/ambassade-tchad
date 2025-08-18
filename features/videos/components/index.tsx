"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from 'nuqs';
import { videoFiltersClient } from '@/features/videos/filters/video.filters';
import { useVideosList } from "@/features/videos/queries/video-list.query";
import { DotLoader } from "react-spinners";
import { DatePicker, Input } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { IVideo, IVideoRechercheParams } from "@/features/videos/types/video.type";
import { getFullUrlFile } from "@/utils/getFullUrlFile";

interface Props {
   searchParams: IVideoRechercheParams
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

  const { data, isLoading, isError } = useVideosList({});

  if (isLoading) {
    return (
      <div className="text-center py-12 flex items-center justify-center h-[80vh]">
        <DotLoader color="#1D4ED8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-12 flex items-center justify-center h-[80vh] w-full">
        {t("error")}
      </div>
    );
  }

  const videos = data || [];

  const handleDateChange = (value: CalendarDate | null) => {
    const dateString = value ? value.toString() : '';
    setFilters({ ...filters, createdAt: dateString, page: 1 });
  };

  // Convertir la string de date en CalendarDate pour le DatePicker
  const selectedDate = filters.createdAt 
    ? new CalendarDate(
        new Date(filters.createdAt).getFullYear(),
        new Date(filters.createdAt).getMonth() + 1,
        new Date(filters.createdAt).getDate()
      )
    : null;

  return (
    <section className="px-6 py-12 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-10 font-mulish">
        {t("description")}
      </h2>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
        <div className="relative w-full max-w-md">
          <Input
            placeholder={t("searchPlaceholder")}
            value={filters.title || ''}
            onChange={(e) => setFilters({ ...filters, title: e.target.value, page: 1 })}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        <div className="relative w-full max-w-md">
          <DatePicker 
            className="w-full py-2 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
            label={t("searchByDate")}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.length > 0 ? (
          videos.map((video: IVideo) => {
            const youtubeId = getFullUrlFile(video.youtubeUrl || '');
            return (
              <div key={video.id} className="rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title={video.title || t("untitled")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                    loading="lazy"
                  />
                </div>
                <div className="bg-card p-4">
                  <h3 className="text-center text-sm font-semibold text-gray-800 mb-2">
                    {video.title || t("untitled")}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-gray-600 text-center line-clamp-2">
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