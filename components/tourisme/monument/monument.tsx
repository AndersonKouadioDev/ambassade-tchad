"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";

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
        className="text-primary text-sm mt-1 underline hover:text-secondary transition-colors"
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
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 mt-8">
          {items.map((item, index) => {
            const images = imagesByMonument[index] ?? [];
            return (
              <div
                key={index}
                className="bg-card shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group h-full"
                onClick={() => {
                  if (images.length) setGallery({ images, currentIndex: 0 });
                }}
              >
                <div className="relative w-full h-64">
                  <Image
                    src={images[0]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white font-semibold px-4 py-2 rounded-full border border-white hover:bg-white hover:text-primary transition-colors">
                      {t("voirGalerie")}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  <TruncatedText text={item.description} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {gallery && (
          <motion.div
            key="gallery-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-5 right-5 text-white hover:text-red-500 z-50 transition-colors"
              onClick={() => setGallery(null)}
              aria-label="Close gallery"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
              {/* Image principale */}
              <motion.div
                key={gallery.images[gallery.currentIndex]}
                className="relative flex-1 h-[70vh] md:h-auto rounded-md overflow-hidden"
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

              {/* Sidebar avec miniatures et navigation */}
              <div className="flex flex-col items-center md:items-start gap-4 w-24 md:w-32 overflow-y-auto max-h-[100vh]">
                <button
                  onClick={prev}
                  className="text-gray-700 hover:text-primary text-2xl mb-2 select-none w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 hover:border-primary transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                {gallery.images.map((src, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setGallery({ images: gallery.images, currentIndex: i })
                    }
                    className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-4 transition-all ${
                      i === gallery.currentIndex
                        ? "border-primary shadow-lg"
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
                  className="text-gray-700 hover:text-primary text-2xl mt-2 select-none w-10 h-10 flex justify-center border rounded-full border-gray-400 items-center hover:border-primary transition-colors"
                  aria-label="Next image"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
