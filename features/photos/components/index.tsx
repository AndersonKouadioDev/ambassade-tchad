"use client";

import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Search, Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { usePhotosList } from "@/features/photos/queries/photo-list.query";
import { useState } from "react";
import { photoFiltersClient } from "@/features/photos/filters/photo.filters";
import { IPhotoRechercheParams } from "@/features/photos/types/photo.type";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SelectedPhoto {
  images: string[];
  initialIndex: number;
  alt: string;
}

export default function GaleryPhotos() {
  const t = useTranslations("gallery.photo");

  const [filters, setFilters] = useQueryStates(
    photoFiltersClient.filter,
    photoFiltersClient.option
  );

  const currentSearchParams: IPhotoRechercheParams = {
    page: Number(filters.page) || 1,
    limit: Number(filters.limit) || 12,
    title: filters.title,
    createdAt: filters.createdAt,
  };

  const { data } = usePhotosList(currentSearchParams);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: e.target.value,
      page: 1,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      createdAt: e.target.value,
      page: 1,
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

  const handleImageClick = (photo: any, imageIndex: number = 0) => {
    const images = photo.imageUrl?.map((url: string) => getFullUrlFile(url)) || [];
    if (images.length > 0) {
      setSelectedPhoto({
        images,
        initialIndex: imageIndex,
        alt: photo.title || t("untitled")
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("description")}
        </h2>
        </div>

        {/* Filtres de recherche améliorés */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={filters.title || ""}
              onChange={handleSearchChange}
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

        {/* Galerie de photos améliorée */}
        {data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {data.data.map((photo) => {
              const imageUrl = photo.imageUrl?.[0]
                ? getFullUrlFile(photo.imageUrl[0])
                : "/placeholder-image.jpg";
              
              const imageCount = photo.imageUrl?.length || 0;

              return (
                <div
                  key={photo.id}
                  className="group relative bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full"
                  onClick={() => handleImageClick(photo)}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={photo.title || t("untitled")}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {imageCount > 1 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur-sm"
                      >
                        <Images className="w-3 h-3 mr-1" />
                        {imageCount}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-center text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {photo.title || t("untitled")}
                    </h3>
                    {photo.description && (
                      <p className="text-sm text-gray-600 text-center line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all duration-300" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {t("noPhotos")}
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {t("noPhotosDescription")}
            </p>
          </div>
        )}
      </div>

      {/* Pagination améliorée */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-6">
          <Button
            onClick={handlePrev}
            disabled={Number(filters.page) <= 1}
            variant="outline"
            size="lg"
            className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 disabled:opacity-50 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              {t("pagination", {
                current: filters.page,
                total: data.meta.totalPages,
              })}
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={Number(filters.page) >= data.meta.totalPages}
            variant="outline"
            size="lg"
            className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 disabled:opacity-50 hover:bg-white hover:shadow-lg transition-all duration-300"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Carousel Modal */}
      {selectedPhoto && (
        <ImageCarousel
          images={selectedPhoto.images}
          initialIndex={selectedPhoto.initialIndex}
          onClose={() => setSelectedPhoto(null)}
          alt={selectedPhoto.alt}
        />
      )}
    </div>
  );
}