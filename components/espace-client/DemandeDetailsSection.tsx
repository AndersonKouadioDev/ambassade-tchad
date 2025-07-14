export default function DemandeDetailsSection() {
  // Liste à plat des champs, chaque sous-tableau = [gauche, droite]
  const fields = [
    ['Tene', 'Ferand'],
    ['9/10/1980', 'Abidjan'],
    ['Ivoirienne', 'Masculin'],
    ['Célibataire', ''],
    ['Ordinaire', '24AT28308'],
    ['3/12/2024', '3/12/2029'],
    ['TCHAD', 'Informaticien'],
    ['13 BP 678 Abidjan 13', '+225 02 67 68 52 98'],
    ['Tourisme', '3 mois'],
    ['TCHAD', 'Contact'],
    ['Observations', ''],
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8 shadow-sm">
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-2xl font-bold text-[#181F2B]">Détails spécifiques de la demande de visa</div>
        <div className="text-base text-[#181F2B] font-semibold">Informations fournies</div>
        <div className="text-sm text-gray-400 italic">Vous trouverez ici le résumé des informations renseignées lors de votre de demande de visa. Ces informations peuvent être mises à jour  en cas de besoins.</div>
      </div>
      <div className="flex flex-col mb-8">
        {fields.map((pair, idx) => (
          pair[0] === 'Observations' ? (
            <div key={idx} className="flex flex-row mb-4">
              <div className="w-[41rem]">
                <div className={`w-[41rem] rounded-full px-6 py-2 text-[#181F2B] text-base font-normal focus:outline-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap ${pair[0] ? 'border border-gray-300 bg-[#FAFAFA]' : 'border border-transparent bg-transparent'}`}>
                  {pair[0] ? pair[0] : ''}
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex flex-row gap-x-6 mb-4">
              <div className="w-80">
                <div className={`w-80 rounded-full px-6 py-2 text-[#181F2B] text-base font-normal focus:outline-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap ${pair[0] ? 'border border-gray-300 bg-[#FAFAFA]' : 'border border-transparent bg-transparent'}`}>
                  {pair[0] ? pair[0] : ''}
                </div>
              </div>
              <div className="w-80">
                <div className={`w-80 rounded-full px-6 py-2 text-[#181F2B] text-base font-normal focus:outline-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap ${pair[1] ? 'border border-gray-300 bg-[#FAFAFA]' : 'border border-transparent bg-transparent'}`}>
                  {pair[1] ? pair[1] : ''}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="flex lg:ml-[400px] mr-10">
        <button className="bg-[#F44C27] text-white rounded-lg px-16 py-3 font-semibold text-base shadow-md hover:bg-[#e03e1a] transition">
          Modifier
        </button>
      </div>
    </div>
  );
} 