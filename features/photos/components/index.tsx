"use client";

import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from 'nuqs';
import { usePhotosList } from "@/features/photos/queries/photo-list.query";
import { useState } from "react";
import { photoFiltersClient } from "@/features/photos/filters/photo.filters";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";
import { DotLoader } from "react-spinners";
import { IPhotoRechercheParams } from "@/features/photos/types/photo.type";

interface IProps {
    searchParams: IPhotoRechercheParams;
}

export default function GaleryPhotos({ searchParams }: IProps) {
  const t = useTranslations("gallery.photo");
  
  // Gestion des filtres avec nuqs
  const [filters, setFilters] = useQueryStates(
    photoFiltersClient.filter, 
    photoFiltersClient.option
  );

  // Paramètres de recherche pour l'API
  const currentSearchParams: IPhotoRechercheParams = {
    page: Number(filters.page) || 1,
    limit: Number(filters.limit) || 12,
    title: filters.title,   
    createdAt: filters.createdAt,
  };

  // Récupération des photos depuis l'API
  const { data, isLoading, isError } = usePhotosList(currentSearchParams);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: e.target.value,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      createdAt: e.target.value,
      page: 1 // Reset à la première page lors d'un nouveau filtre date
    });
  };

  const handleNext = () => {
    if (data?.meta && filters.page < data.meta.totalPages) {
      setFilters({ ...filters, page: Number(filters.page) + 1 });
    }
  };

  const handlePrev = () => {
    if (Number(filters.page) > 1) {
      setFilters({ ...filters, page: Number(filters.page) - 1 });
    }
  };

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

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
        {t("description")}
      </h2>
      
      {/* Barres de recherche */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-20">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={filters.title || ''}
            onChange={handleSearchChange}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>

        <div className="relative w-full max-w-md">
          <input
            type="date"
            value={filters.createdAt || ''}
            onChange={handleDateChange}
            className="w-full py-3 pl-12 pr-4 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white shadow-sm"
          />
          <Calendar className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* Galerie de photos */}
      <div className="flex flex-col items-center ">
        {data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 px-10">
            {data.data.map((photo) => {
              // Vérification que imageUrl existe et a au moins un élément
              const imageUrl = photo.imageUrl?.[0] ? formatImageUrl(photo.imageUrl[0]) : '/placeholder-image.jpg';
              
              return (
                <div
                  key={photo.id}
                  className="bg-card shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <div className="relative h-80 w-[300px]">
                    <Image
                      src={imageUrl}
                      alt={photo.title || t("untitled")}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-center text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                      {photo.title || t("untitled")}
                    </h3>
                    {photo.description && (
                      <p className="text-xs text-gray-600 text-center line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">
              {t("noPhotos")}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={Number(filters.page) <= 1}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <span className="text-sm">
            {t("pagination", {
              current: filters.page,
              total: data.meta.totalPages
            })}
          </span>
          
          <button
            onClick={handleNext}
            disabled={Number(filters.page) >= data.meta.totalPages}
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded-full shadow disabled:opacity-70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 z-50"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative aspect-video w-full">
              <Image
                src={selectedImage}
                alt={t("fullImage")}
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}