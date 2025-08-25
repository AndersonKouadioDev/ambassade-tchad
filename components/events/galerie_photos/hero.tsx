import Image from "next/image";
import { useTranslations } from "next-intl";
import BreadcrumbNav from "./breadcrumbs";

export default function Hero() {
  const t = useTranslations("gallery.photo.hero");
  return (
    <div className="relative w-full h-[calc(100vh-200px)] lg:h-[400px] xl:h-[500px]">
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src="/assets/images/backgrounds/bg-ambassade-1.png"
        alt="herosection"
        fill
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary to-transparent"></div>
      <div className="relative z-20 mx-auto max-w-screen-2xl h-full flex items-center justify-start text-white px-4">
        <div className="flex flex-col gap-6">
          <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {t("title")}
          </div>
          <BreadcrumbNav />
        </div>
      </div>
    </div>
  );
}
