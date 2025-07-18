interface Step {
  label: string;
  date: string;
  done: boolean;
}

export default function HistoriqueTraitement({ steps, progression }: { steps: Step[]; progression: number }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Historique du Traitement</h2>
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Service : Recouvrement</div>
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Demande : Visa</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xl font-bold text-gray-900 dark:text-white">Progression</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{progression}%</span>
          <div className="w-16 md:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-2 bg-orange-500" style={{ width: `${progression}%` }}></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xl font-bold text-gray-900 dark:text-white">Achèvement prévu</div>
        <div className="text-gray-700 dark:text-gray-200 text-base">16 Juillet 2025</div>
        <div className="text-gray-500 dark:text-gray-300 text-sm">14 Jours</div>
      </div>
    </div>
  );
} 