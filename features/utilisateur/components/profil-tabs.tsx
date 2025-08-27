import {ActiveTabType, SetActiveTabType, TFunction} from "@/features/utilisateur/types";

export const ProfilTabs = ({t, activeTab, setActiveTab}: {
    t: TFunction,
    activeTab: ActiveTabType,
    setActiveTab: SetActiveTabType
}) => (
    <div className="flex border-b border-gray-200  mb-6">
        <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 font-semibold text-base transition-colors ${
                activeTab === 'view'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500  hover:text-gray-700'
            }`}
        >
            {t('voirProfil')}
        </button>
        <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-3 font-semibold text-base transition-colors ${
                activeTab === 'edit'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500  hover:text-gray-700'
            }`}
        >
            {t('modifierProfil')}
        </button>
    </div>
);