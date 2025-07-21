"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const statusColors: Record<string, string> = {
  'NEW': 'bg-blue-100 text-blue-700',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-700',
  'PENDING': 'bg-orange-100 text-orange-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'READY_TO_PICKUP': 'bg-green-100 text-green-700',
  'REJECTED': 'bg-red-100 text-red-700',
  // Anciens statuts pour compatibilité
  'nouveau': 'bg-green-100 text-green-700',
  'enCours': 'bg-yellow-100 text-yellow-700',
  'enAttente': 'bg-yellow-100 text-yellow-700',
  'pretARetirer': 'bg-yellow-100 text-yellow-700',
};

interface Filters {
  ticket?: string;
  service?: string;
  status?: string;
}

export interface RequestItem {
  ticket: string;
  service: string;
  date: string;
  status: string;
}

interface RequestsTableProProps {
  filters?: Filters;
  requests?: RequestItem[];
}

export default function RequestsTablePro({ filters, requests = [] }: RequestsTableProProps) {
  const t = useTranslations('espaceClient.dashboard.requestsTable');
  const locale = useLocale();
  
  // S'assurer que requests est un tableau
  const safeRequests = Array.isArray(requests) ? requests : [];
  
  const filteredRequests = safeRequests.filter((req) => {
    const ticketMatch = !filters?.ticket || req.ticket.toLowerCase().includes(filters.ticket.toLowerCase());
    const serviceMatch = !filters?.service || req.service === filters.service;
    const statusMatch = !filters?.status || req.status === filters.status;
    return ticketMatch && serviceMatch && statusMatch;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 w-full h-auto flex flex-col">
      <div className="text-base md:text-xl font-bold text-[#181F2B] dark:text-white mb-2 md:mb-4">{t('title')}</div>
      {/* Table sur sm+ */}
      <div className="hidden sm:block overflow-x-auto -mx-2 md:-mx-6">
        <table className="w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-[#F6F8FA] dark:bg-gray-700 text-[#181F2B] dark:text-gray-200 text-left">
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">{t('ticketNumber')}</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">{t('serviceConcerne')}</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">{t('dateSubmission')}</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">{t('currentStatus')}</th>
              <th className="py-2 md:py-3 px-2 md:px-6 font-semibold">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.ticket} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
                <td className="py-2 md:py-3 px-2 md:px-6 font-semibold text-[#6B7280] dark:text-gray-400">{req.ticket}</td>
                <td className="py-2 md:py-3 px-2 md:px-6 font-bold text-[#181F2B] dark:text-white">{req.service}</td>
                <td className="py-2 md:py-3 px-2 md:px-6 text-[#181F2B] dark:text-gray-200">{req.date}</td>
                <td className="py-2 md:py-3 px-2 md:px-6">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                    {(() => {
                      const statusTranslations: Record<string, string> = {
                        'NEW': 'Nouveau',
                        'IN_PROGRESS': 'En cours',
                        'PENDING': 'En attente',
                        'COMPLETED': 'Terminé',
                        'READY_TO_PICKUP': 'Prêt à retirer',
                        'REJECTED': 'Rejeté',
                      };
                      return statusTranslations[req.status] || req.status;
                    })()}
                  </span>
                </td>
                <td className="py-2 md:py-3 px-2 md:px-6">
                  <Link href={`/${locale}/espace-client/mes-demandes/${req.ticket}`} className="w-full md:w-auto px-2 md:px-4 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs md:text-sm bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition block text-center">
                    {t('voir')}
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
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                {(() => {
                  const statusTranslations: Record<string, string> = {
                    'NEW': 'Nouveau',
                    'IN_PROGRESS': 'En cours',
                    'PENDING': 'En attente',
                    'COMPLETED': 'Terminé',
                    'READY_TO_PICKUP': 'Prêt à retirer',
                    'REJECTED': 'Rejeté',
                  };
                  return statusTranslations[req.status] || req.status;
                })()}
              </span>
            </div>
            <div className="text-xs text-[#6B7280] dark:text-gray-400">{t('ticket')} : <span className="font-semibold">{req.ticket}</span></div>
            <div className="text-xs text-[#181F2B] dark:text-gray-200">{t('date')} : {req.date}</div>
            <Link href={`/${locale}/espace-client/mes-demandes/${req.ticket}`} className="mt-2 w-full px-3 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition block text-center">
              {t('voir')}
            </Link>
          </div>
        ))}
      </div>
      <div className="text-right mt-2">
        <Link href={`/${locale}/espace-client/mes-demandes`} className="text-[#F44C27] text-xs md:text-sm font-semibold hover:underline">{t('voirToutesDemandes')}</Link>
      </div>
    </div>
  );
} 