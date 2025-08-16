"use client";

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Package, 
  FileText,
  User,
  UserCheck,
  Crown,
  Archive
} from 'lucide-react';
import { DemandeStatus } from '@/features/demande/types/demande.type';
import { IDemande } from '@/features/demande/types/demande.type';

interface RequestTrackerProps {
  request: DemandeStatus;
  demande: IDemande;
}

// Configuration des statuts avec traductions et styles
const STATUS_CONFIG = {
  [DemandeStatus.NEW]: {
    label: 'Nouvelle demande',
    description: 'Votre demande a été soumise avec succès',
    icon: FileText,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    step: 1
  },
  [DemandeStatus.IN_REVIEW_DOCS]: {
    label: 'Examen des documents',
    description: 'Nos agents examinent vos documents',
    icon: User,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    step: 2
  },
  [DemandeStatus.PENDING_ADDITIONAL_INFO]: {
    label: 'Informations supplémentaires requises',
    description: 'Des informations complémentaires sont nécessaires',
    icon: AlertCircle,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    step: 2.5
  },
  [DemandeStatus.APPROVED_BY_AGENT]: {
    label: 'Approuvé par l\'agent',
    description: 'Votre demande a été approuvée par notre agent',
    icon: UserCheck,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    step: 3
  },
  [DemandeStatus.APPROVED_BY_CHEF]: {
    label: 'Approuvé par le chef de service',
    description: 'Validation par le chef de service effectuée',
    icon: UserCheck,
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    step: 4
  },
  [DemandeStatus.APPROVED_BY_CONSUL]: {
    label: 'Approuvé par le consul',
    description: 'Validation finale par le consul effectuée',
    icon: Crown,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    step: 5
  },
  [DemandeStatus.READY_FOR_PICKUP]: {
    label: 'Prêt pour retrait',
    description: 'Votre document est prêt à être retiré',
    icon: Package,
    color: 'bg-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    step: 6
  },
  [DemandeStatus.DELIVERED]: {
    label: 'Remis',
    description: 'Document remis avec succès',
    icon: CheckCircle,
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    step: 7
  },
  [DemandeStatus.REJECTED]: {
    label: 'Rejetée',
    description: 'Votre demande a été rejetée',
    icon: XCircle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    step: -1
  },
  [DemandeStatus.ARCHIVED]: {
    label: 'Archivée',
    description: 'Demande archivée',
    icon: Archive,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    step: 8
  },
  [DemandeStatus.EXPIRED]: {
    label: 'Expirée',
    description: 'La demande a expiré',
    icon: Clock,
    color: 'bg-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    step: -2
  },
  [DemandeStatus.RENEWAL_REQUESTED]: {
    label: 'Renouvellement demandé',
    description: 'Une demande de renouvellement a été initiée',
    icon: FileText,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    step: 0
  }
};

// Étapes du workflow normal
const WORKFLOW_STEPS = [
  DemandeStatus.NEW,
  DemandeStatus.IN_REVIEW_DOCS,
  DemandeStatus.APPROVED_BY_AGENT,
  DemandeStatus.APPROVED_BY_CHEF,
  DemandeStatus.APPROVED_BY_CONSUL,
  DemandeStatus.READY_FOR_PICKUP,
    DemandeStatus.DELIVERED
];

export default function RequestTracker({ demande }: RequestTrackerProps) {
  const currentStatus = demande.status as DemandeStatus;
  const currentConfig = STATUS_CONFIG[currentStatus];
  const currentStep = currentConfig.step;

  // Calculer le pourcentage de progression
  const getProgressPercentage = () => {
    if (currentStep < 0) return 0; // Statuts d'erreur
    if (currentStep === 7) return 100; // Terminé
    return Math.min((currentStep / 7) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* En-tête avec statut actuel */}
      <div className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${currentConfig.color} p-2 rounded-full text-white`}>
              <currentConfig.icon size={20} />
            </div>
            <div>
              <h3 className={`font-semibold ${currentConfig.textColor}`}>
                {currentConfig.label}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentConfig.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentConfig.bgColor} ${currentConfig.textColor} border ${currentConfig.borderColor}`}>
              {currentConfig.label}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mis à jour le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              currentStep < 0 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Timeline des étapes */}
      <div className="px-6 py-4">
        <h4 className="font-semibold text-gray-800 mb-4">Suivi détaillé</h4>
        <div className="space-y-4">
          {WORKFLOW_STEPS.map((status) => {
            const config = STATUS_CONFIG[status];
            const isCompleted = config.step <= currentStep && currentStep > 0;
            const isCurrent = status === currentStatus;
            const isPending = config.step > currentStep;

            return (
              <div key={status} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                    ? `${config.color} border-current text-white`
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={16} />
                  ) : (
                    <config.icon size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isCurrent ? config.textColor : isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {config.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {config.description}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {isCompleted && '✓'}
                  {isCurrent && '●'}
                  {isPending && '○'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historique des changements de statut */}
      {demande.statusHistory && demande.statusHistory.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-3">Historique des modifications</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {demande.statusHistory
              .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
              .map((history) => (
                <div key={history.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[history.newStatus]?.color || 'bg-gray-400'}`} />
                    <span className="text-gray-700">
                      {STATUS_CONFIG[history.newStatus]?.label || history.newStatus}
                    </span>
                    {history.reason && (
                      <span className="text-gray-500">- {history.reason}</span>
                    )}
                  </div>
                  <span className="text-gray-400">
                    {new Date(history.changedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions disponibles */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Demande N° <span className="font-mono font-medium">{demande.ticketNumber}</span>
          </div>
          <div className="flex space-x-2">
            {currentStatus === DemandeStatus.PENDING_ADDITIONAL_INFO && (
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                Fournir des informations
              </button>
            )}
            {currentStatus === DemandeStatus.READY_FOR_PICKUP && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Planifier le retrait
              </button>
            )}
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Contacter l&apos;ambassade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
