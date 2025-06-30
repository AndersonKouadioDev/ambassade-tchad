"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function GaleryPhotos() {
  const t = useTranslations("photo");
  const [search, setSearch] = useState("");

  type Picture = {
    picture: string;
    title: string;
  };

  const pictures: Picture[] = [
    {
      picture: "/assets/images/illustrations/ambassade/card_1.png",
      title: t("pictures.0"),
    },
    {
      picture: "/assets/images/illustrations/ambassade/card_2.png",
      title: t("pictures.1"),
    },
    {
      picture: "/assets/images/illustrations/ambassade/card_3.png",
      title: t("pictures.2"),
    },
    {
      picture: "/assets/images/illustrations/ambassade/card_4.png",
      title: t("pictures.3"),
    },
  ];
  const filteredPictures = pictures.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const [start, setStart] = useState(0);
  const visibleCount = 6;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleNext = () => {
    if (start + visibleCount < pictures.length) setStart(start + visibleCount);
  };

  const handlePrev = () => {
    if (start - visibleCount >= 0) setStart(start - visibleCount);
  };

  return (
    <div className="px-6 py-10 mb-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8 font-mulish">
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

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 mb-8 px-10">
          {pictures.slice(start, start + visibleCount).map((item) => (
            <div
              key={item.title}
              className="bg-card shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => setSelectedImage(item.picture)}
            >
              <Image
                src={item.picture}
                alt={item.title}
                width={300}
                height={250}
                className="w-full h-80 object-cover"
              />
              <div className="p-4 text-center text-sm text-gray-600 font-semibold  tracking-wide">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        <div className="md:flex gap-3">
          <button
            onClick={handlePrev}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-secondary hover:bg-red-600 text-white rounded-full shadow"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Clean Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent close on image click
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-10 hover:bg-opacity-70 rounded-full p-2 z-50"
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
