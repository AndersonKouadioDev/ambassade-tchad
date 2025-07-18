"use client";

import { useState } from 'react';
import RequestsTablePro from '@/components/espace-client/RequestsTablePro';
import { useTranslations } from 'next-intl';

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

export default function MesDemandesClient() {
  const t = useTranslations('espaceClient.mesDemandesClient');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    ticket: '',
    service: '',
    status: '',
  });

  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">{t('description')}</p>
          </div>
          <button
            className="bg-white dark:bg-gray-800 border border-orange-500 text-orange-500 font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-sm hover:bg-orange-500 hover:text-white transition-all text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => setShowFilter((v) => !v)}
          >
            {t('filtrer')} <span className="ml-1">▼</span>
          </button>
        </div>
        {/* Panneau de filtre */}
        {showFilter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1">{t('noTicket')}</label>
                <input
                  type="text"
                  placeholder={t('placeholderTicket')}
                  value={filters.ticket}
                  onChange={e => setFilters(f => ({ ...f, ticket: e.target.value }))}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1">{t('typeService')}</label>
                <select
                  value={filters.service}
                  onChange={e => setFilters(f => ({ ...f, service: e.target.value }))}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="">{t('tous')}</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1">{t('statut')}</label>
                <select
                  value={filters.status}
                  onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="">{t('tous')}</option>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="w-full lg:w-auto">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all text-sm w-full lg:w-auto"
                  onClick={() => setShowFilter(false)}
                >
                  {t('appliquer')}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-0 sm:p-6 w-full">
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 px-4 pt-4 sm:px-0 sm:pt-0">{t('listeDemandes')}</div>
          <RequestsTablePro filters={filters} />
        </div>
        
      </div>
    </div>
  );
}