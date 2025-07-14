export default function ProfilSection() {
  return (
    <div className="bg-[#F6F8FA] dark:bg-gray-900 min-h-screen w-full p-8">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold text-[#181F2B] dark:text-white mb-1">Mon Profil</h1>
        <p className="text-[#6B7280] dark:text-gray-300 mb-6">Retrouvez ici l'historique et le statut de toutes vos demandes auprès de l'Ambassade du Tchad.</p>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="text-2xl font-bold text-[#181F2B] dark:text-white mb-2 md:mb-0">Modifier le compte</div>
            <div className="flex gap-4">
              <button className="bg-[#F44C27] text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md hover:bg-[#e03e1a] transition">Modifier mon mot de passe</button>
              <button className="bg-gray-300 dark:bg-gray-700 text-white rounded-lg px-8 py-2 font-semibold text-base shadow-md cursor-not-allowed">Supprimer mon compte</button>
            </div>
          </div>
          <div className="text-base text-[#181F2B] dark:text-white mb-2">Les champs annotés d’un * sont obligatioies.</div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-6" />
          <div className="text-xl font-bold text-[#181F2B] dark:text-white mb-4">Mon identité</div>
          <form className="flex flex-col gap-6">
            <div className="flex flex-row gap-x-6">
              <div className="w-80">
                <label className="block text-[#181F2B] dark:text-white font-semibold mb-2">Nom *</label>
                <input type="text" placeholder="Nom" className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-900 px-6 py-2 text-[#181F2B] dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-400 font-normal focus:outline-none" />
              </div>
              <div className="w-80">
                <label className="block text-[#181F2B] dark:text-white font-semibold mb-2">Prénom (s)*</label>
                <input type="text" placeholder="Prénom (s)" className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-900 px-6 py-2 text-[#181F2B] dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-400 font-normal focus:outline-none" />
              </div>
            </div>
            <div className="flex flex-row gap-x-6">
              <div className="w-80">
                <label className="block text-[#181F2B] dark:text-white font-semibold mb-2">Langue dans laquelle vous souhaitez renseigner votre demande de visa *</label>
                <select className="w-80 rounded-full border border-gray-300 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-900 px-6 py-2 text-[#181F2B] dark:text-white text-base font-normal focus:outline-none cursor-pointer">
                  <option className="dark:bg-gray-900">Français</option>
                  <option className="dark:bg-gray-900">Anglais</option>
                  <option className="dark:bg-gray-900">Arabe</option>
                </select>
              </div>
              <div className="w-80"></div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" className="bg-[#F44C27] text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md hover:bg-[#e03e1a] transition">Enregistrer</button>
              <button type="button" className="bg-gray-300 dark:bg-gray-700 text-white rounded-lg px-12 py-2 font-semibold text-base shadow-md">Mes demandes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 