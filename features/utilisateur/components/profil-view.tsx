import { TFunction } from "@/features/utilisateur/types";
import { IUser } from "@/features/auth/types/auth.type";

export const ProfilView = ({ t, data }: { t: TFunction; data?: IUser }) => (
  <div>
    <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      {t("monIdentite")}
    </div>

    <div className="flex flex-col gap-6">
      {/* Ligne Nom + Prénom */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900 dark:text-white font-semibold mb-2">
            {t("nom")}
          </label>
          <div className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
            {data?.lastName}
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900 dark:text-white font-semibold mb-2">
            {t("prenom")}
          </label>
          <div className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
            {data?.firstName}
          </div>
        </div>
      </div>

      {/* Ligne Email + Téléphone */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900 dark:text-white font-semibold mb-2">
            Email
          </label>
          <div className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
            {data?.email}
          </div>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900 dark:text-white font-semibold mb-2">
            Téléphone
          </label>
          <div className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-2 text-gray-900 dark:text-white text-base">
            {data?.phoneNumber}
          </div>
        </div>
      </div>
    </div>
  </div>
);
