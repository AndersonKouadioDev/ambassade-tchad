'use client';

import { useTranslations } from 'next-intl';
import { X, Bell, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  text: string;
  status: 'enCours' | 'requis' | 'pretARetirer';
  read: boolean;
  date: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

const statusColors: Record<string, string> = {
  'enCours': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'requis': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'pretARetirer': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
};

export default function NotificationsModal({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onMarkAsUnread 
}: NotificationsModalProps) {
  const t = useTranslations('espaceClient.notifications');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  if (!isOpen) return null;
  
  console.log('Notifications Modal rendering:', { isOpen, notificationsCount: notifications.length });

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'read') return notif.read;
    if (filter === 'unread') return !notif.read;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('modal.title')}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('modal.all')}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'unread' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('modal.unread')}
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'read' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('modal.read')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('modal.empty')}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-lg border transition ${
                    notif.read 
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600' 
                      : 'bg-white border-orange-200 dark:bg-gray-800 dark:border-orange-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[notif.status] || 'bg-gray-100 text-gray-700'}`}>
                          {t(`status.${notif.status}`)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notif.date}</span>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${notif.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
                        {notif.text}
                      </p>
                    </div>
                    <button
                      onClick={() => notif.read ? onMarkAsUnread(notif.id) : onMarkAsRead(notif.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {notif.read ? t('modal.markAsUnread') : t('modal.markAsRead')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}