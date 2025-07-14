import { Image as ImageIcon, Upload } from 'lucide-react';

export default function DocumentsSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8 shadow-sm">
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-2xl font-bold text-[#181F2B]">Documents</div>
        <div className="text-base text-[#181F2B]">Liste des documents fournis</div>
        <div className="text-sm text-gray-400 italic">Importez jusqu'à 10 fichiers compatibles. 100 MB max. par fichier.</div>
      </div>
      <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
        <div className="flex flex-col gap-4 flex-1 min-w-[250px]">
          {/* Document 1 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 flex items-center justify-between min-w-[220px]">
              <span className="text-gray-500 flex items-center gap-2 text-base">
                Afficher le document 1
                <ImageIcon className="w-5 h-5 text-gray-300" />
              </span>
            </div>
            <button className="border border-[#003399] text-[#003399] rounded-full px-6 py-2 flex items-center gap-2 font-semibold hover:bg-[#003399]/10 transition text-base">
              <Upload className="w-5 h-5" />
              Modifier le document
            </button>
          </div>
          {/* Document 2 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 flex items-center justify-between min-w-[220px]">
              <span className="text-gray-500 flex items-center gap-2 text-base">
                Afficher le document 2
                <ImageIcon className="w-5 h-5 text-gray-300" />
              </span>
            </div>
            <button className="border border-[#003399] text-[#003399] rounded-full px-6 py-2 flex items-center gap-2 font-semibold hover:bg-[#003399]/10 transition text-base">
              <Upload className="w-5 h-5" />
              Modifier le document
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 items-end justify-start min-w-[300px] mt-4 md:mt-0">
          <button className="border border-[#003399] text-[#003399] rounded-full px-8 py-2 flex items-center gap-2 font-semibold hover:bg-[#003399]/10 transition text-base w-full md:w-auto">
            <Upload className="w-5 h-5" />
            Ajouter un nouveau document
          </button>
        </div>
      </div>
    </div>
  );
} 