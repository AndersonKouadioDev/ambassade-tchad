"use client";

import React, { useState } from 'react';
import RequestTracker from './RequestTracker';
import RequestNotifications from './RequestNotifications';
import DemandeDetailsSection from './DemandeDetailsSection';
import { useRequestTracking } from '@/hooks/useRequestTracking';
import { IDemande } from '@/feature/demande/types/demande.type';
import { Search, FileText, Bell, Download, Phone, RefreshCw } from 'lucide-react';

interface RequestTrackingSystemProps {
  initialRequest?: IDemande;
}

export default function RequestTrackingSystem({ initialRequest }: RequestTrackingSystemProps) {
  const { request, isLoading, error, trackRequest, clearRequest, refreshRequest } = useRequestTracking(initialRequest);
  const [ticketNumber, setTicketNumber] = useState('');

  // Fonction pour rechercher une demande par numéro de ticket
  const handleTrackRequest = async () => {
    await trackRequest(ticketNumber);
  };

  // Actions rapides
  const quickActions = [
    {
      icon: Phone,
      label: 'Contacter l\'ambassade',
      action: () => window.open('tel:+22501245578485'),
      variant: 'outline' as const
    },
    {
      icon: Download,
      label: 'Télécharger le reçu',
      action: () => window.print(),
      variant: 'secondary' as const
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => alert('Fonctionnalité à venir'),
      variant: 'ghost' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-3 text-blue-600" size={28} />
                  Suivi de demande
                </h1>
                <p className="text-gray-600 mt-1">
                  Suivez l'état de votre demande consulaire en temps réel
                </p>
              </div>
              <div className="flex space-x-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      action.variant === 'outline'
                        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : action.variant === 'secondary'
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <action.icon size={16} className="mr-2" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        {!request && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="text-center mb-6">
              <Search className="mx-auto text-blue-600 mb-4" size={48} />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rechercher votre demande
              </h2>
              <p className="text-gray-600">
                Saisissez votre numéro de ticket pour suivre l'état de votre demande
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                    placeholder="Ex: TCD-2024-001234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackRequest()}
                  />
                </div>
                <button
                  onClick={handleTrackRequest}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search size={16} className="mr-2" />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Exemple de formats de tickets */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Formats acceptés :</p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span className="font-mono">TCD-2024-001234</span>
                <span className="font-mono">TCD001234</span>
                <span className="font-mono">001234</span>
              </div>
            </div>
          </div>
        )}

        {/* Système de suivi complet */}
        {request && (
          <div className="space-y-6">
            {/* Bouton retour à la recherche */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  clearRequest();
                  setTicketNumber('');
                }}
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Nouvelle recherche
              </button>
              
              <div className="text-sm text-gray-500">
                Dernière mise à jour : {new Date(request.updatedAt).toLocaleString('fr-FR')}
              </div>
            </div>

            {/* Notifications */}
            <RequestNotifications request={request} />
            
            {/* Tracker de progression */}
            <RequestTracker request={request} />
            
            {/* Détails complets */}
            <DemandeDetailsSection demande={request} />
          </div>
        )}

        {/* Informations utiles */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Informations utiles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Horaires d'ouverture</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>Lundi - Vendredi : 8h00 - 16h00</li>
                <li>Samedi : 8h00 - 12h00</li>
                <li>Dimanche : Fermé</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Contact</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>Tél : +225 01 23 45 67 89</li>
                <li>Email : contact@ambassade-tchad.com</li>
                <li>Adresse : Cocody 2 Plateaux, Abidjan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
