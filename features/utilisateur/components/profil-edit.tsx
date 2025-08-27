import { SetActiveTabType, TanstackField, TFunction } from "@/features/utilisateur/types";

export const ProfilEdit = ({
  t,
  handleSubmit,
  Field,
  setActiveTab,
}: {
  t: TFunction;
  handleSubmit: () => void;
  Field: TanstackField;
  setActiveTab: SetActiveTabType;
}) => (
  <div>
    <div className="text-base text-gray-900  mb-2">
      {t("champsObligatoires")}
    </div>
    <div className="border-t border-gray-200  my-6" />
    <div className="text-xl font-bold text-gray-900  mb-4">
      {t("monIdentite")}
    </div>

    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Ligne Nom + Prénom */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900  font-semibold mb-2">
            {t("nom")} *
          </label>
          <Field name="lastName">
            {(field) => (
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-full border border-gray-300  bg-white  px-6 py-2 text-gray-900  text-base focus:outline-none focus:border-orange-500"
              />
            )}
          </Field>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900  font-semibold mb-2">
            {t("prenom")} *
          </label>
          <Field name="firstName">
            {(field) => (
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-full border border-gray-300  bg-white  px-6 py-2 text-gray-900  text-base focus:outline-none focus:border-orange-500"
              />
            )}
          </Field>
        </div>
      </div>

      {/* Ligne Email + Téléphone */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900  font-semibold mb-2">
            Email *
          </label>
          <Field name="email">
            {(field) => (
              <input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-full border border-gray-300  bg-white  px-6 py-2 text-gray-900  text-base focus:outline-none focus:border-orange-500"
              />
            )}
          </Field>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-gray-900  font-semibold mb-2">
            Téléphone *
          </label>
          <Field name="phoneNumber">
            {(field) => (
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-full border border-gray-300  bg-white  px-6 py-2 text-gray-900  text-base focus:outline-none focus:border-orange-500"
              />
            )}
          </Field>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          type="submit"
          className="bg-orange-500 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-orange-600 transition"
        >
          {t("enregistrer")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("view")}
          className="bg-gray-300  text-gray-700  rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-gray-400 transition"
        >
          {t("annuler")}
        </button>
      </div>
    </form>
  </div>
);
