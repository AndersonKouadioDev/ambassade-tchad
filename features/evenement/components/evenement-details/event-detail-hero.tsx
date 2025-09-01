"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { IEvenement } from "../../types/evenement.type";
import { useState } from "react";
import { getFullUrlFile } from "@/utils/getFullUrlFile";
import Image from "next/image";

export default function EventDetailHero({ event }: { event: IEvenement }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const hasImages = event.imageUrl && event.imageUrl.length > 0;
  const selectedImage = hasImages ? event.imageUrl?.[selectedImageIndex] : "";
  const totalImages = event.imageUrl?.length ?? 0;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  if (!hasImages) return null;

  return (
    <div className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Image principale */}
      <div className="relative w-full h-full">
        <Image
          className="w-full h-full object-cover"
          src={getFullUrlFile(selectedImage)}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Contrôles de navigation pour les images multiples */}
        {totalImages > 1 && (
          <>
            {/* Boutons de navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicateurs de position */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {event.imageUrl?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "bg-white shadow-lg"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Compteur d'images */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {selectedImageIndex + 1} / {totalImages}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
