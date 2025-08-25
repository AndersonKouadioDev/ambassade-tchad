import { Metadata } from "next";
import Image from "next/image";
import AuthForm from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Connexion - Ambassade du Tchad",
  description:
    "Connexion et inscription à l'espace membre de l'Ambassade du Tchad en Côte d'Ivoire",
  keywords: "connexion, inscription, ambassade tchad, espace membre",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-200px)] lg:h-[400px] xl:h-[500px]">
        <Image
          className="absolute inset-0 w-full h-full object-cover shrink-0"
          src="/assets/images/backgrounds/bg-ambassade-1.png"
          alt="herosection"
          fill
          priority
        />
        <div className="absolute w-full h-full bg-gradient-to-r from-primary to-transparent" />
        <div className="relative z-20 mx-auto max-w-screen-2xl h-full flex items-center justify-start text-white px-4">
          <div className="flex flex-col gap-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
              Connexion
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire centré */}
      <AuthForm />
    </div>
  );
}
