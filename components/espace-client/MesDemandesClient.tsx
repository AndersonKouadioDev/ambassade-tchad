"use client";

import { useState, useEffect } from 'react';
import RequestsTablePro, { RequestItem } from '@/components/espace-client/RequestsTablePro';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

const SERVICES = [
  'Carte Consulaire',
  'Visa',
  'Laissez-passer',
  'Procuration',
  'Acte de Capacité de Mariage',
  'Acte de Décès',
  'Certificat de Nationalité',
  'Acte de Naissance',
];

const STATUS = [
  'NEW',
  'IN_PROGRESS',
  'PENDING',
  'COMPLETED',
  'READY_TO_PICKUP',
  'REJECTED',
];

export default function MesDemandesClient() {
  const t = useTranslations('espaceClient.mesDemandesClient');
  const { data: session } = useSession();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    ticket: '',
    service: '',
    status: '',
  });
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!session) {
        console.log('No session found, skipping fetch');
        setLoading(false);
        setError('Session non trouvée. Veuillez vous reconnecter.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Session found:', session);
        console.log('Session user:', session.user);
        console.log('Session token:', session.user?.token);
        
        // Préparer les headers avec le token d'authentification
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Ajouter le token d'authentification
        if (session.user?.token) {
          headers['Authorization'] = `Bearer ${session.user.token}`;
          console.log('Token added to headers');
        } else {
          console.log('No token found in session');
        }

        console.log('Request headers:', headers);
        
        const res = await fetch('http://localhost:8081/api/v1/demandes/me', {
          method: 'GET',
          credentials: 'include',
          headers,
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Erreur ${res.status}: ${errorText || 'Erreur lors du chargement des demandes'}`);
        }
        const data = await res.json();
        console.log('API Response:', data); // Debug
        
        // Extraire les demandes de la structure { meta: {...}, data: [...] }
        const demandes = data?.data || [];
        
        // Fonction pour traduire les types de service
        const translateServiceType = (serviceType: string) => {
          const translations: Record<string, string> = {
            'CONSULAR_CARD': 'Carte Consulaire',
            'POWER_OF_ATTORNEY': 'Procuration',
            'MARRIAGE_CAPACITY_ACT': 'Acte de Capacité de Mariage',
            'LAISSEZ_PASSER': 'Laissez-passer',
            'DEATH_ACT_APPLICATION': 'Acte de Décès',
            'NATIONALITY_CERTIFICATE': 'Certificat de Nationalité',
            'BIRTH_ACT_APPLICATION': 'Acte de Naissance',
            'VISA': 'Visa',
          };
          return translations[serviceType] || serviceType;
        };

        // Mapping selon la structure réelle de l'API
        const mapped = demandes.map((d: any) => ({
          ticket: d.ticketNumber || d.ticket || d.id || '',
          service: translateServiceType(d.serviceType || d.service || d.type || ''),
          date: d.submissionDate ? new Date(d.submissionDate).toLocaleDateString('fr-FR') : '',
          status: d.status || d.statut || '',
        }));
        
        console.log('Mapped requests:', mapped); // Debug
        setRequests(mapped);
              } catch (e: any) {
          console.error('Fetch error:', e);
          setError(e.message || 'Erreur inconnue');
        } finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }, [session]);

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
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              Chargement des demandes...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <div className="text-lg mb-2">⚠️</div>
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Réessayer
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">📋</div>
              Aucune demande trouvée
            </div>
                      ) : (
              <>
                {/* Demandes en attente */}
                {(() => {
                  const pendingRequests = requests.filter(req => req.status === 'PENDING');
                  return pendingRequests.length > 0 ? (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          📋 My Pending Requests ({pendingRequests.length})
                        </h3>
                        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          En attente
                        </span>
                      </div>
                      <RequestsTablePro filters={filters} requests={pendingRequests} />
                    </div>
                  ) : null;
                })()}

                {/* Toutes les demandes */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      📊 All Requests ({requests.length})
                    </h3>
                  </div>
                  <RequestsTablePro filters={filters} requests={requests} />
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}