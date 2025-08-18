"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const imagesByMonument = [
  ["/assets/images/illustrations/tourisme/card1.png"],
  ["/assets/images/illustrations/tourisme/card2.png"],
  ["/assets/images/illustrations/tourisme/card3.png"],
  ["/assets/images/illustrations/tourisme/card4.png"],
  [
    "/assets/images/illustrations/tourisme/parc_sen_oura_1.jpg",
    "/assets/images/illustrations/tourisme/parc_sen_oura_2.jpg",
  ],
  [
    "/assets/images/illustrations/tourisme/parc_goz_beida_1.jpg",
    "/assets/images/illustrations/tourisme/parc_goz_beida_2.jpg",
  ],
  [
    "/assets/images/illustrations/tourisme/parc_zaa_soo_1.jpg",
    "/assets/images/illustrations/tourisme/parc_zaa_soo_2.jpg",
    "/assets/images/illustrations/tourisme/parc_zaa_soo_3.jpg",
  ],
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
  const t = useTranslations("tourisme.monuments");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  const [gallery, setGallery] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

  const prev = () => {
    if (!gallery) return;
    setGallery({
      images: gallery.images,
      currentIndex:
        (gallery.currentIndex - 1 + gallery.images.length) %
        gallery.images.length,
    });
  };

  const next = () => {
    if (!gallery) return;
    setGallery({
      images: gallery.images,
      currentIndex: (gallery.currentIndex + 1) % gallery.images.length,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const images = imagesByMonument[index] ?? [];
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className="relative w-full h-48 cursor-pointer group"
                onClick={() => {
                  if (images.length) setGallery({ images, currentIndex: 0 });
                }}
              >
                <Image
                  src={images[0]}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-semibold px-4 py-2 bg-primary rounded-md shadow-md">
                    {t("voirGalerie")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-secondary text-lg font-semibold">
                  {item.title}
                </h2>
                <TruncatedText text={item.description} />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {gallery && (
          <motion.div
            key="gallery-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-5 right-5 text-white text-4xl font-bold hover:text-red-500 transition"
              onClick={() => setGallery(null)}
              aria-label="Close gallery"
            >
              &times;
            </button>

            <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
              {/* Large image */}
              <motion.div
                key={gallery.images[gallery.currentIndex]}
                className="relative flex-1 h-[70vh] md:h-auto rounded-md overflow-hidden cursor-zoom-in"
              >
                <Image
                  src={gallery.images[gallery.currentIndex]}
                  alt={`Image ${gallery.currentIndex + 1}`}
                  width={800}
                  height={600}
                  className="object-contain w-full h-auto max-h-[70vh] mx-auto"
                  priority
                />
              </motion.div>

              {/* Sidebar thumbnails + navigation */}
              <div className="flex flex-col items-center md:items-start gap-4 w-24 md:w-32 overflow-y-auto max-h-[100vh] ">
                <button
                  onClick={prev}
                  className="text-gray-700 hover:text-primary text-3xl mb-2 select-none w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-primary transition"
                  aria-label="Previous image"
                >
                  &#8593;
                </button>
                {gallery.images.map((src, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setGallery({ images: gallery.images, currentIndex: i })
                    }
                    className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-4 ${
                      i === gallery.currentIndex
                        ? "border-primary"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      priority={i === gallery.currentIndex}
                    />
                  </div>
                ))}
                <button
                  onClick={next}
                  className="text-gray-700 hover:text-primary text-3xl mt-2 select-none w-10 h-10 flex justify-center border rounded-full border-gray-400 items-center hover:border-primary transition"
                  aria-label="Next image"
                >
                  &#8595;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
