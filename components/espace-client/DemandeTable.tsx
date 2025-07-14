interface Demande {
  ticket: string;
  service: string;
  dateSoumission: string;
  status: string;
  montant: string;
  dateDelivrance: string;
}

export default function DemandeTable({ demande }: { demande: Demande }) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-xs md:text-sm border-collapse">
        <thead>
          <tr className="bg-[#F6F8FA] dark:bg-gray-700 text-[#181F2B] dark:text-gray-200 text-left">
            <th className="py-2 px-4 font-semibold">N° TICKET</th>
            <th className="py-2 px-4 font-semibold">SERVICE CONCERNÉ</th>
            <th className="py-2 px-4 font-semibold">DATE DE SOUMISSION</th>
            <th className="py-2 px-4 font-semibold">STATUT ACTUEL</th>
            <th className="py-2 px-4 font-semibold">MONTANT (FCFA)</th>
            <th className="py-2 px-4 font-semibold">DATE DE DÉLIVRANCE</th>
            <th className="py-2 px-4 font-semibold">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 dark:border-gray-600 last:border-0">
            <td className="py-2 px-4 font-semibold text-[#6B7280] dark:text-gray-400">{demande.ticket}</td>
            <td className="py-2 px-4 font-bold text-[#181F2B] dark:text-white">{demande.service}</td>
            <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200">{demande.dateSoumission}</td>
            <td className="py-2 px-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{demande.status}</span>
            </td>
            <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200">{demande.montant || '-'}</td>
            <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200">{demande.dateDelivrance || '-'}</td>
            <td className="py-2 px-4">
              <button className="px-4 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition">Voir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 