"use client";
import { useState } from 'react';
import RequestsTablePro from '@/components/espace-client/RequestsTablePro';

const SERVICES = [
  'CONSULAT',
  'VISA',
  'PASSEPORT',
  'CARTE CONSULAIRE',
  'LAISSEZ-PASSER',
  'PROCURATION',
];
const STATUS = [
  'Nouveau',
  'En Cours',
  'En Attente',
  'Prêt À Retirer',
];

export default function MesDemandes() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    ticket: '',
    service: '',
    status: '',
  });

  return (
    <div className="bg-[#F6F8FA] dark:bg-gray-900 min-h-screen w-full p-4 md:p-8">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#181F2B] dark:text-white mb-1">Mes demandes</h1>
            <p className="text-gray-500 dark:text-gray-300">Retrouvez ici l&apos;historique et le statut de toutes vos demandes auprès de l&apos;Ambassade du Tchad.</p>
          </div>
          <button
            className="bg-white dark:bg-gray-800 border border-[#F44C27] text-[#F44C27] font-semibold px-6 py-2 rounded-xl shadow-sm hover:bg-[#F44C27] hover:text-white transition-all text-sm flex items-center gap-2"
            onClick={() => setShowFilter((v) => !v)}
          >
            FILTRER PAR <span className="ml-1">▼</span>
          </button>
        </div>
        {/* Panneau de filtre */}
        {showFilter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-end animate-fade-in">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#181F2B] dark:text-white mb-1">N°TICKET</label>
              <input
                type="text"
                placeholder="Ex: T001"
                value={filters.ticket}
                onChange={e => setFilters(f => ({ ...f, ticket: e.target.value }))}
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-[#181F2B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F44C27]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#181F2B] dark:text-white mb-1">TYPE DE SERVICE</label>
              <select
                value={filters.service}
                onChange={e => setFilters(f => ({ ...f, service: e.target.value }))}
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-[#181F2B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F44C27]"
              >
                <option value="">Tous</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#181F2B] dark:text-white mb-1">STATUT</label>
              <select
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-[#181F2B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F44C27]"
              >
                <option value="">Tous</option>
                {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold px-6 py-2 rounded-xl shadow transition-all text-sm ml-0 md:ml-4"
              onClick={() => setShowFilter(false)}
            >Appliquer</button>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-0 md:p-6 w-full">
          <div className="text-xl font-bold text-[#181F2B] dark:text-white mb-4 px-4 pt-4">Listes des demandes</div>
          <RequestsTablePro filters={filters} />
        </div>
        
      </div>
    </div>
  );
} 