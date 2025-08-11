import { Metadata } from 'next';
import Image from 'next/image';
import AuthForm from '@/features/auth/components/auth-form';
// import { useTranslations } from 'next-intl'; // Supprimé car inutilisé au niveau module

export const metadata: Metadata = {
    title: 'Connexion - Ambassade du Tchad',
    description: 'Connexion et inscription à l\'espace membre de l\'Ambassade du Tchad en Côte d\'Ivoire',
    keywords: 'connexion, inscription, ambassade tchad, espace membre',
};


export default function AuthPage() {
    return (
        <div className="min-h-screen bg-[#F6F8FA]">
            {/* Hero identique à l'event */}
            <div className="relative flex items-center justify-between w-full h-[calc(60vh-100px)] min-h-[20px]">
                <Image
                    className="absolute inset-0 w-full h-full object-cover shrink-0"
                    src="/assets/images/backgrounds/bg-ambassade-1.png"
                    alt="herosection"
                    fill
                    priority
                />
                <div className="absolute w-full h-full bg-gradient-to-r from-primary to-transparent px-4" />
                <div className="absolute px-4 pt-4 inset-0 flex flex-col bottom-2 items-start justify-center text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-10 md:gap-20 lg:gap-32">
                    <div className="mx-auto relative right-0 lg:right-80 justify-start p-8 flex flex-col gap-6">
                        <div className="text-5xl font-bold drop-shadow-lg">Connexion</div>
                        {/* <Breadcrumb /> */}
                    </div>
                </div>
            </div>
            {/* Formulaire centré */}
            <div className="flex justify-center items-start w-full mt-8 md:mt-12 lg:mt-16">
                <div className="w-full  p-6 md:p-10]">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}
