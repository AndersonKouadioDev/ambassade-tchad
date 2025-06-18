"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const pictures = [
  "/assets/images/illustrations/tourisme/card1.png",
  "/assets/images/illustrations/tourisme/card2.png",
  "/assets/images/illustrations/tourisme/card3.png",
  "/assets/images/illustrations/tourisme/card4.png",
  "/assets/images/illustrations/tourisme/tourisme_1.jpg",
  "/assets/images/illustrations/tourisme/tourisme_2.jpg",
  "/assets/images/illustrations/tourisme/tourisme_3.jpg",
  "/assets/images/illustrations/tourisme/tourisme_4.jpg",
  "/assets/images/illustrations/tourisme/tourisme_5.jpg",
  "/assets/images/illustrations/tourisme/tourisme_6.jpg"
];

function TruncatedText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("tourisme.monument");

  return (
    <div>
      <p className={`text-sm text-gray-700 ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 text-sm mt-1 underline"
      >
        {expanded ? t("lireMoins") : t("lirePlus")}
      </button>
    </div>
  );
}

export default function Monument() {
  const t = useTranslations("tourisme.monument");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const items = t.raw("items") as Array<{ title: string; subtitle: string }>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="group relative bg-white shadow rounded-lg overflow-hidden cursor-pointer"
          >
            <div
              className="relative h-48 w-full overflow-hidden"
              onClick={() => setSelectedImage(pictures[index])}
            >
              <Image
                src={pictures[index]}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold bg-primary px-4 py-2 rounded-md shadow-md">
                  {t("voirPlus")}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg text-secondary mb-2">
                {item.title}
              </h2>
              <TruncatedText text={item.subtitle} />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90vw] h-[80vh] max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Agrandissement"
              layout="fill"
              className="object-contain rounded-md shadow-lg"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
