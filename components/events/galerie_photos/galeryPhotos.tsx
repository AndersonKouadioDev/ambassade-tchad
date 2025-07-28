"use client";

import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { getAllPhotos, searchPhotos } from "@/lib/gallery-store";
// Import seulement les fonctions utilisées

export default function GaleryPhotos() {
  const t = useTranslations("gallery.photo");
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  
  // Récupérer toutes les photos
  const allPhotos = useMemo(() => getAllPhotos(), []);
  
  // Filtrer les photos en fonction de la recherche
  const filteredPhotos = useMemo(() => {
    if (!search && !searchDate) return allPhotos;
    
    let filtered = allPhotos;
    
    if (search) {
      filtered = searchPhotos(search);
    }
    
    if (searchDate) {
      const selectedDate = new Date(searchDate);
      filtered = filtered.filter(photo => {
        const photoDate = new Date(photo.createdAt);
        return photoDate.getFullYear() === selectedDate.getFullYear() && 
               photoDate.getMonth() === selectedDate.getMonth() && 
               photoDate.getDate() === selectedDate.getDate();
      });
    }
    
    return filtered;
  }, [search, searchDate, allPhotos]);
 
  const [start, setStart] = useState(0);
  const visibleCount = 6;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleNext = () => {
    if (start + visibleCount < filteredPhotos.length) setStart(start + visibleCount);
  };

  const handlePrev = () => {
    if (start - visibleCount >= 0) setStart(start - visibleCount);
  };

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
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

      <div className="flex flex-col items-center">
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 px-10">
            {filteredPhotos.slice(start, start + visibleCount).map((photo) => (
              <div
                key={photo.id}
                className="bg-card shadow-lg rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(photo.imageUrl)}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title || 'Photo de l\'ambassade'}
                  width={300}
                  height={250}
                  className="w-full h-80 object-cover transition-transform transform hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="text-center text-sm font-semibold text-gray-800 tracking-wide mb-1">
                    {photo.title || t("untitled")}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-gray-600 text-center">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">
              {t("noPhotos")}
            </p>
          </div>
        )}
        </div>
        <div className="md:flex gap-3">
          <button
            onClick={handlePrev}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
            aria-label={t("previous")}
            title={t("previous")}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded-full shadow"
            aria-label={t("next")}
            title={t("next")}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      {/* Clean Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-10 hover:bg-opacity-70 rounded-full p-2 z-50"
              aria-label={t("close")}
              title={t("close")}
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Full image"
              width={650}
              height={500}
              className="object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
