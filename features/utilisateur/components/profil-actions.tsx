import {SetActiveTabType, TFunction} from "@/features/utilisateur/types";

export const ProfilActions = ({t, setActiveTab}: { t: TFunction, setActiveTab: SetActiveTabType }) => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
            {t('modifierCompte')}
        </div>
        <div className="flex gap-4">
            <button
                onClick={() => setActiveTab('password')}
                className="bg-orange-500 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition"
            >
                {t('modifierMotDePasse')}
            </button>
            <button
                className="bg-gray-300 dark:bg-gray-700 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md cursor-not-allowed">
                {t('supprimerCompte')}
            </button>
        </div>
    </div>
);