'use client';

import { useTranslations } from 'next-intl';
import { X, MessageCircle, Reply, User } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  read: boolean;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  'high': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'low': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export default function MessagesModal({ 
  isOpen, 
  onClose, 
  messages, 
  onMarkAsRead, 
  onMarkAsUnread 
}: MessagesModalProps) {
  const t = useTranslations('espaceClient.dashboard.messages');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!isOpen) return null;
  
  console.log('Messages Modal rendering:', { isOpen, messagesCount: messages.length });

  const filteredMessages = messages.filter(message => {
    if (filter === 'read') return message.read;
    if (filter === 'unread') return !message.read;
    return true;
  });

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      onMarkAsRead(message.id);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedMessage ? selectedMessage.subject : t('modal.title')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedMessage && (
              <button 
                onClick={handleBackToList}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1 text-sm"
              >
                ← Retour
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!selectedMessage ? (
          <>
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
                  Tous
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

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('modal.empty')}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((message) => (
                    <div 
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
                        message.read 
                          ? 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600' 
                          : 'bg-white border-orange-200 dark:bg-gray-800 dark:border-orange-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{message.sender}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[message.priority]}`}>
                              {message.priority}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{message.date}</span>
                            {!message.read && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <h3 className={`font-semibold mb-1 ${message.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                            {message.subject}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if(message.read) {
                              onMarkAsUnread(message.id);
                            } else {
                              onMarkAsRead(message.id);
                            }
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          {message.read ? t('modal.markAsUnread') : t('modal.markAsRead')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Message Detail View */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedMessage.sender}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[selectedMessage.priority]}`}>
                  {selectedMessage.priority}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{selectedMessage.date}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedMessage.subject}</h2>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
            <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
              <Reply className="w-4 h-4" />
              {t('modal.reply')}
            </button>
          </div>
        )}

        {/* Footer */}
        {!selectedMessage && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={onClose}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition font-medium"
            >
              {t('modal.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}