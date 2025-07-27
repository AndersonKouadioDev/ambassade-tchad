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
  const t = useTranslations('espaceClient.mesDemandesClient');
  const locale = useLocale();
  
  // Filtrer les demandes selon les critères
  const filteredRequests = requests.filter(req => {
    if (filters?.ticket && !req.ticket.toLowerCase().includes(filters.ticket.toLowerCase())) {
      return false;
    }
    if (filters?.service && req.service !== filters.service) {
      return false;
    }
    if (filters?.status && req.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusTranslation = (status: string) => {
    const statusTranslations: Record<string, string> = {
      'NEW': t('statuts.NEW'),
      'IN_PROGRESS': t('statuts.IN_PROGRESS'),
      'PENDING': t('statuts.PENDING'),
      'COMPLETED': t('statuts.COMPLETED'),
      'READY_TO_PICKUP': t('statuts.READY_TO_PICKUP'),
      'REJECTED': t('statuts.REJECTED'),
    };
    return statusTranslations[status] || status;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Ticket
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequests.map((req, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {req.ticket}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {req.service}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {req.date}
              </td>
              <td className="py-2 md:py-3 px-2 md:px-6">
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                  {getStatusTranslation(req.status)}
                </span>
              </td>
              <td className="py-2 md:py-3 px-2 md:px-6">
                <Link href={`/${locale}/espace-client/mes-demandes/${req.ticket}`} className="w-full md:w-auto px-2 md:px-4 py-1 rounded border border-[#F44C27] text-[#F44C27] font-semibold text-xs md:text-sm bg-white dark:bg-gray-700 hover:bg-[#F44C27] hover:text-white transition block text-center">
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 