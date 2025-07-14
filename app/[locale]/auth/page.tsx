import { Metadata } from 'next';
import Image from 'next/image';
import LoginForm from '@/components/auth/login-form';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'Connexion - Ambassade du Tchad',
    description: 'Connexion et inscription à l\'espace membre de l\'Ambassade du Tchad en Côte d\'Ivoire',
    keywords: 'connexion, inscription, ambassade tchad, espace membre',
};

function Breadcrumb() {
    const t = useTranslations('auth.hero.breadcrumb');
    
    return (
        <nav className="text-white text-base md:text-lg font-light flex gap-2">
            <span>{t('home')}</span>
            <span>&gt;</span>
            <span>{t('menu')}</span>
            <span>&gt;</span>
            <span>{t('visaRequest')}</span>
        </nav>
    );
}

export default function AuthPage() {
    const t = useTranslations('auth.hero');
    
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
                        <div className="text-5xl font-bold drop-shadow-lg">{t('title')}</div>
                        <Breadcrumb />
                    </div>
                </div>
            </div>
            {/* Formulaire centré */}
            <div className="flex justify-center items-start w-full mt-8 md:mt-12 lg:mt-16">
                <div className="w-full max-w-xl  p-6 md:p-10 z-20  ">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
