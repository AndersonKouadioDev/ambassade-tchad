// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useTranslations } from "next-intl";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const pictures = [
//   "/assets/images/illustrations/tourisme/card1.png",
//   "/assets/images/illustrations/tourisme/card2.png",
//   "/assets/images/illustrations/tourisme/card3.png",
//   "/assets/images/illustrations/tourisme/card4.png",
//   "/assets/images/illustrations/tourisme/tourisme_1.jpg",
//   "/assets/images/illustrations/tourisme/tourisme_2.jpg",
//   "/assets/images/illustrations/tourisme/tourisme_3.jpg",
//   "/assets/images/illustrations/tourisme/tourisme_4.jpg",
//   "/assets/images/illustrations/tourisme/tourisme_5.jpg",
//   "/assets/images/illustrations/tourisme/tourisme_6.jpg",
// ];

// function TruncatedText({ text }: { text: string }) {
//   const [expanded, setExpanded] = useState(false);
//   const t = useTranslations("tourisme.monument");

//   return (
//     <div>
//       <p className={`text-sm text-gray-700 ${expanded ? "" : "line-clamp-3"}`}>
//         {text}
//       </p>
//       <button
//         onClick={() => setExpanded(!expanded)}
//         className="text-blue-600 text-sm mt-1 underline"
//       >
//         {expanded ? t("lireMoins") : t("lirePlus")}
//       </button>
//     </div>
//   );
// }

// export default function Monument() {
//   const t = useTranslations("tourisme.monument");
//   const [showSlider, setShowSlider] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);

//   const items = t.raw("items") as Array<{ title: string; subtitle: string }>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {items.map((item, index) => (
//           <div
//             key={item.title}
//             className="group relative bg-white shadow rounded-lg overflow-hidden cursor-pointer"
//           >
//             <div
//               className="relative h-48 w-full overflow-hidden"
//               onClick={() => {
//                 setStartIndex(index);
//                 setShowSlider(true);
//               }}
//             >
//               <Image
//                 src={pictures[index]}
//                 alt={item.title}
//                 fill
//                 className="object-cover transition-transform duration-300 group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                 <span className="text-white text-lg font-semibold bg-primary px-4 py-2 rounded-md shadow-md">
//                   {t("voirPlus")}
//                 </span>
//               </div>
//             </div>
//             <div className="p-4">
//               <h2 className="font-semibold text-lg text-secondary mb-2">
//                 {item.title}
//               </h2>
//               <TruncatedText text={item.subtitle} />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Slider / Lightbox */}
//       {showSlider && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
//           <button
//             onClick={() => setShowSlider(false)}
//             className="absolute top-4 right-6 text-white text-3xl z-50"
//           >
//             ✕
//           </button>

//           <div className="w-full max-w-5xl px-6">
//             <Swiper
//               modules={[Navigation, Pagination]}
//               navigation
//               pagination={{ clickable: true }}
//               initialSlide={startIndex}
//               spaceBetween={30}
//               slidesPerView={1}
//               className="rounded-lg overflow-hidden"
//             >
//               {pictures.map((src, idx) => (
//                 <SwiperSlide key={idx}>
//                   <div className="relative w-full h-[70vh]">
//                     <Image
//                       src={src}
//                       alt={`Slide ${idx}`}
//                       fill
//                       className="object-contain rounded-md"
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

// Images associées à chaque monument, indexées par position
const imagesByMonument = [
  [
    "/assets/images/illustrations/tourisme/card1.png",
  ],
  [
    "/assets/images/illustrations/tourisme/card2.png",
  ],
  [
    
    "/assets/images/illustrations/tourisme/card3.png",
  ],
  [
    
    "/assets/images/illustrations/tourisme/card4.png",
  ],
 
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

const safeIndex = (index: number, length: number) => {
  return ((index % length) + length) % length;
};

export default function Monument() {
  const t = useTranslations("tourisme.monument");

  // Récupération des textes uniquement
  const items = t.raw("items") as Array<{ title: string; subtitle: string }>;

  const [slider, setSlider] = useState<{ images: string[]; index: number } | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          // Récupère les images associées via l'index
          const images = imagesByMonument[index] ?? [];

          return (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div
                className="relative w-full h-48 cursor-pointer"
                onClick={() => images.length && setSlider({ images, index: 0 })}
              >
                <Image
                  src={images[0]}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-semibold px-4 py-2 bg-primary rounded-md">
                    {t("voirGalerie")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-secondary text-lg font-semibold">{item.title}</h2>
                <TruncatedText text={item.subtitle} />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {slider &&
          slider.images.length > 0 &&
          slider.index >= 0 &&
          slider.index < slider.images.length && (
            <motion.div
              key="slider"
              className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setSlider(null)}
                className="absolute top-4 right-6 text-white text-3xl"
              >
                ✕
              </button>

              <div className="relative w-full max-w-4xl h-[70vh] mb-4">
                <Image
                  src={slider.images[slider.index]}
                  alt="Image en plein écran"
                  fill
                  className="object-contain rounded-md shadow-lg transition duration-300"
                  priority
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setSlider((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: safeIndex(prev.index - 1, prev.images.length),
                          }
                        : null
                    )
                  }
                  className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  ◀ {t("precedent")}
                </button>
                <button
                  onClick={() =>
                    setSlider((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: safeIndex(prev.index + 1, prev.images.length),
                          }
                        : null
                    )
                  }
                  className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  {t("suivant")} ▶
                </button>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
