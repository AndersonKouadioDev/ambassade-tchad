"use client";

import React from 'react';
import { RequestStatus, RequestWithRelations } from '@/types/request.types';
import { Bell, Info, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface RequestNotificationsProps {
  request: RequestWithRelations;
}

export default function RequestNotifications({ request }: RequestNotificationsProps) {
  const currentStatus = request.status as RequestStatus;

  // Configuration des notifications selon le statut
  const getNotificationConfig = () => {
    switch (currentStatus) {
      case RequestStatus.NEW:
        return {
          type: 'info' as const,
          icon: Info,
          title: 'Demande reçue',
          message: 'Votre demande a été enregistrée avec succès. Vous recevrez une notification dès qu\'elle sera prise en charge.',
          actions: []
        };

      case RequestStatus.IN_REVIEW_DOCS:
        return {
          type: 'info' as const,
          icon: Clock,
          title: 'Examen en cours',
          message: 'Nos agents examinent actuellement vos documents. Cette étape prend généralement 2-3 jours ouvrables.',
          actions: []
        };

      case RequestStatus.PENDING_ADDITIONAL_INFO:
        return {
          type: 'warning' as const,
          icon: AlertTriangle,
          title: 'Action requise',
          message: 'Des informations complémentaires sont nécessaires pour traiter votre demande. Veuillez les fournir dans les plus brefs délais.',
          actions: [
            { label: 'Fournir les informations', href: '#', primary: true }
          ]
        };

      case RequestStatus.APPROVED_BY_AGENT:
      case RequestStatus.APPROVED_BY_CHEF:
      case RequestStatus.APPROVED_BY_CONSUL:
        return {
          type: 'success' as const,
          icon: CheckCircle,
          title: 'Demande approuvée',
          message: 'Votre demande a été approuvée et suit son cours normal de traitement.',
          actions: []
        };

      case RequestStatus.READY_FOR_PICKUP:
        return {
          type: 'success' as const,
          icon: Bell,
          title: 'Prêt pour retrait',
          message: 'Votre document est prêt ! Vous pouvez venir le retirer aux heures d\'ouverture avec une pièce d\'identité.',
          actions: [
            { label: 'Voir les horaires', href: '#', primary: false },
            { label: 'Planifier le retrait', href: '#', primary: true }
          ]
        };

      case RequestStatus.DELIVERED:
        return {
          type: 'success' as const,
          icon: CheckCircle,
          title: 'Document remis',
          message: 'Votre document a été remis avec succès. Merci de votre confiance !',
          actions: [
            { label: 'Évaluer le service', href: '#', primary: false }
          ]
        };

      case RequestStatus.REJECTED:
        return {
          type: 'error' as const,
          icon: AlertTriangle,
          title: 'Demande rejetée',
          message: 'Votre demande a été rejetée. Consultez les observations pour plus de détails ou contactez notre service.',
          actions: [
            { label: 'Contacter l\'ambassade', href: '#', primary: true },
            { label: 'Nouvelle demande', href: '#', primary: false }
          ]
        };

      default:
        return null;
    }
  };

  const config = getNotificationConfig();
  if (!config) return null;

  const typeStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    }
  };

  const styles = typeStyles[config.type];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start space-x-3">
        <div className={`${styles.iconColor} mt-0.5`}>
          <config.icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.titleColor} mb-1`}>
            {config.title}
          </h3>
          <p className={`${styles.messageColor} text-sm mb-3`}>
            {config.message}
          </p>
          
          {/* Observations spécifiques */}
          {request.observations && (currentStatus === RequestStatus.REJECTED || currentStatus === RequestStatus.PENDING_ADDITIONAL_INFO) && (
            <div className="bg-white/60 rounded p-3 mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Détails :</p>
              <p className="text-sm text-gray-600 italic">{request.observations}</p>
            </div>
          )}

          {/* Actions */}
          {config.actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.actions.map((action, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    action.primary
                      ? config.type === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : config.type === 'warning'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
