import React from 'react';
import Link from 'next/link';

const requests = [
  { ticket: 'T001', service: 'CONSULAT', date: '02 / 07 / 2025', status: 'Nouveau' },
  { ticket: 'T002', service: 'CONSULAT', date: '02 / 07 / 2025', status: 'En Cours' },
  { ticket: 'T003', service: 'CONSULAT', date: '02 / 07 / 2025', status: 'En Attente' },
  { ticket: 'T004', service: 'CONSULAT', date: '02 / 07 / 2025', status: 'Prêt À Retirer' },
  { ticket: 'T005', service: 'CONSULAT', date: '02 / 07 / 2025', status: 'En Cours' },
];

const statusColors: Record<string, string> = {
  'Nouveau': 'bg-green-100 text-green-700',
  'En Cours': 'bg-yellow-100 text-yellow-700',
  'En Attente': 'bg-yellow-100 text-yellow-700',
  'Prêt À Retirer': 'bg-yellow-100 text-yellow-700',
};

interface Filters {
  ticket?: string;
  service?: string;
  status?: string;
}

interface RequestsTableProProps {
  filters?: Filters;
}

export default function RequestsTablePro({ filters }: RequestsTableProProps) {
  const filteredRequests = requests.filter((req) => {
    const ticketMatch = !filters?.ticket || req.ticket.toLowerCase().includes(filters.ticket.toLowerCase());
    const serviceMatch = !filters?.service || req.service === filters.service;
    const statusMatch = !filters?.status || req.status === filters.status;
    return ticketMatch && serviceMatch && statusMatch;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 w-full h-auto flex flex-col">
      <div className="text-base md:text-xl font-bold text-[#181F2B] dark:text-white mb-2 md:mb-4">Mes demandes en cours</div>
      {/* Table sur sm+ */}
      <div className="hidden sm:block overflow-x-auto -mx-2 md:-mx-6">
        <table className="w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-[#F6F8FA] dark:bg-gray-700 text-[#181F2B] dark:text-gray-200 text-left">
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">N° TICKET</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">SERVICE CONCERNÉ</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">DATE DE SOUMISSION</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">STATUT ACTUEL</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.ticket} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                <td className="py-2 md:py-3 px-2 md:px-6 font-semibold text-[#6B7280] dark:text-gray-400">{req.ticket}</td>
                <td className="py-2 md:py-3 px-2 md:px-6 font-bold text-[#181F2B] dark:text-white">{req.service}</td>
                <td className="py-2 md:py-3 px-2 md:px-6 text-[#181F2B] dark:text-gray-200">{req.date}</td>
                <td className="py-2 md:py-3 px-2 md:px-6">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>{req.status}</span>
                </td>
                <td className="py-2 md:py-3 px-2 md:px-6">
                  <Link href={`/espace-client/mes-demandes/${req.ticket}`} passHref >
                    <a className="w-full md:w-auto px-2 md:px-4 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs md:text-sm bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition block text-center">Voir</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards sur mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filteredRequests.map((req) => (
          <div key={req.ticket} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col gap-2 max-w-xs mx-auto w-full">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#181F2B] dark:text-white text-sm">{req.service}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>{req.status}</span>
            </div>
            <div className="text-xs text-[#6B7280] dark:text-gray-400">Ticket : <span className="font-semibold">{req.ticket}</span></div>
            <div className="text-xs text-[#181F2B] dark:text-gray-200">Date : {req.date}</div>
            <Link href={`/espace-client/mes-demandes/${req.ticket}`} passHref legacyBehavior>
              <a className="mt-2 w-full px-3 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition block text-center">Voir</a>
            </Link>
          </div>
        ))}
      </div>
      <div className="text-right mt-2">
        <a href="#" className="text-[#F44C27] text-xs md:text-sm font-semibold hover:underline">Voir Toutes Les Demandes</a>
      </div>
    </div>
  );
} 