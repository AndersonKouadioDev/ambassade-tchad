// Composant pour l'en-tête du profil
import {TFunction} from "@/features/utilisateur/types";

export const ProfilHeader = ({t}: { t: TFunction }) => (
    <>
        <h1 className="text-2xl font-bold text-gray-900  mb-1">{t('title')}</h1>
        <p className="text-gray-500  mb-6">{t('description')}</p>
    </>
);