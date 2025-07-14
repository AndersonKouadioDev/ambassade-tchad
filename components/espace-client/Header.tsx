'use client';
import Image from 'next/image';
import { Mail, Bell, Search, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const notificationsDemo = [
  { text: 'Votre Demande De Visa Ticket N°T001 Est Passée Au Statut', status: 'En Cours' },
  { text: 'Documents Supplémentaires Nécessaire Pour Votre Demande De Visa Ticket N°T001 Est Passée Au Statut', status: 'Requis' },
  { text: 'Votre Visa Ticket N°T001 Est Prêt À Être Retiré À L\'ambassade Du Tchad.', status: 'Prêt À Retirer' },
];

const messagesDemo = [
  { text: 'Votre demande de visa a été approuvée. Veuillez vous présenter à l\'ambassade.', sender: 'Service Consulaire', date: 'Aujourd\'hui', status: 'Non Lu' },
  { text: 'Documents supplémentaires requis pour votre dossier.', sender: 'Service Immigration', date: 'Hier', status: 'Important' },
  { text: 'Confirmation de votre rendez-vous pour le 15 décembre.', sender: 'Service Rendez-vous', date: 'Il y a 2 jours', status: 'Lu' },
  { text: 'Votre passeport est prêt à être retiré.', sender: 'Service Passeport', date: 'Il y a 3 jours', status: 'Répondu' },
];

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setMessagesOpen(false);
      }
    }
    if (notificationsOpen || messagesOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, messagesOpen]);

  const languages = [
    { code: 'fr', label: 'Français', flag: 'fr.png' },
    { code: 'en', label: 'English', flag: 'en.svg' },
    { code: 'ar', label: 'العربية', flag: 'ar.png' },
  ];
  const getInitialLang = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedLang');
      return languages.find(l => l.code === saved) || languages[0];
    }
    return languages[0];
  };
  const [selectedLang, setSelectedLang] = useState(getInitialLang);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (langDropdownOpen && langButtonRef.current) {
      const rect = langButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [langDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langButtonRef.current && !langButtonRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedLang');
      const found = languages.find(l => l.code === saved);
      if (found) setSelectedLang(found);
      else setSelectedLang(languages[0]);
    }
  }, []);

  function handleLangSelect(lang: typeof languages[0]) {
    setSelectedLang(lang);
    setLangDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLang', lang.code);
    }
    // TODO: Ajouter la logique de changement de langue (routing, i18n, etc.)
  }

  return (
    <header className="h-12 sm:h-14 bg-[#003399] border-r-blue-900 border-r-2 flex items-center px-2 sm:px-6 justify-between w-full gap-2 sm:gap-4 overflow-x-hidden">
      {/* Mobile : trigger, notifications, profil */}
      <div className="flex items-center w-full justify-between sm:hidden">
        <div className="block sm:hidden">
          <button
            className="flex items-center justify-center bg-white dark:bg-blue-900 rounded-full p-2 shadow border border-slate-200 dark:border-blue-800"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Image src="/assets/icons/sidebar-trigger.png" alt="Ouvrir le menu" width={24} height={24} priority />
          </button>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-[#F44C27]/50"
              onClick={() => setNotificationsOpen((v) => !v)}
              aria-label="Voir les notifications"
            >
              <Bell className="text-[#003399] w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">{notificationsDemo.length}</span>
            </button>
            {notificationsOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-[#F44C27]/10">
                <div className="px-4 py-2 border-b font-bold text-[#181F2B] bg-[#F6F8FA] text-sm">Notifications</div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {notificationsDemo.map((notif, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-[#F6F8FA] transition group cursor-pointer"
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${notif.status === 'En Cours' ? 'bg-green-400' : notif.status === 'Prêt À Retirer' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                      <div className="flex-1 text-xs text-[#181F2B] leading-snug">
                        {notif.text}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-sm border ${notif.status === 'En Cours' ? 'bg-green-50 text-green-700 border-green-100' : notif.status === 'Prêt À Retirer' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'} group-hover:scale-105 transition-transform`}>{notif.status}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="block text-center text-[#F44C27] text-xs font-semibold py-2 hover:underline bg-[#F6F8FA]">Voir toutes les notifications</a>
              </div>
            )}
          </div>
          {/* Profil */}
          <button className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full">
            <ChevronDown className="text-white w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Desktop : recherche, langue, thème, messages, notifications, profil */}
      <div className="hidden sm:flex items-center w-full justify-between">
        {/* Barre de recherche */}
        <div className="flex items-center min-w-0 flex-1 mx-4">
          <div className="flex items-center bg-transparent border-0 w-full">
            <Search className="text-white opacity-60 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-0 outline-none text-white placeholder-white/60 text-base w-full max-w-xs"
              style={{ letterSpacing: '0.01em' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Langue - Dropdown */}
          <div className="relative">
            <button
              ref={langButtonRef}
              className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F44C27]/50"
              onClick={() => setLangDropdownOpen((v) => !v)}
              aria-label="Changer de langue"
            >
              <Image src={`/assets/flags/${selectedLang.flag}`} alt={selectedLang.label} width={24} height={24} className="rounded-full" />
              <span className="text-white dark:text-white font-semibold text-sm">{selectedLang.label.toUpperCase()}</span>
              <ChevronDown className="text-white   w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div
                className="fixed bg-white dark:bg-blue-900 rounded-xl shadow-2xl border border-gray-100 dark:border-blue-800 z-[10050] animate-fade-in flex flex-col overflow-hidden ring-1 ring-[#F44C27]/10"
                style={{
                  top: dropdownPosition.top + 8, // 8px de marge sous le bouton
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                }}
              >
                {languages.map((lang, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors w-full text-left relative
                      ${selectedLang.code === lang.code
                        ? 'bg-[#F6F8FA] dark:bg-blue-800 font-bold text-[#003399] dark:text-white'
                        : 'hover:bg-[#F6F8FA] dark:hover:bg-blue-800 text-[#181F2B] dark:text-white'}`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    <Image src={`/assets/flags/${lang.flag}`} alt={lang.label} width={20} height={20} className="rounded-full" />
                    <span className="flex-1 text-[#181F2B] dark:text-white">{lang.label}</span>
                    {selectedLang.code === lang.code && (
                      <Check className="w-4 h-4 text-[#003399] dark:text-white absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Thème */}
          <button 
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
          >
            {theme === 'light' ? (
              <Moon className="text-[#003399] w-5 h-5" />
            ) : (
              <Sun className="text-[#003399] w-5 h-5" />
            )}
          </button>
          {/* Messages */}
          <div className="relative" ref={messagesRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-[#F44C27]/50"
              onClick={() => setMessagesOpen((v) => !v)}
              aria-label="Voir les messages"
            >
              <Mail className="text-[#003399] w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">{messagesDemo.filter(m => m.status === 'Non Lu').length}</span>
            </button>
            {messagesOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-[#F44C27]/10">
                <div className="px-4 py-2 border-b font-bold text-[#181F2B] bg-[#F6F8FA] text-sm">Messages</div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {messagesDemo.map((message, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-[#F6F8FA] transition group cursor-pointer"
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${message.status === 'Non Lu' ? 'bg-red-400' : message.status === 'Important' ? 'bg-orange-400' : message.status === 'Répondu' ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[#181F2B] leading-snug">{message.sender}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{message.date}</div>
                        <div className="text-xs text-[#181F2B] leading-snug mt-1 line-clamp-2">{message.text}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-sm border flex-shrink-0 ${message.status === 'Non Lu' ? 'bg-red-50 text-red-700 border-red-100' : message.status === 'Important' ? 'bg-orange-50 text-orange-700 border-orange-100' : message.status === 'Répondu' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'} group-hover:scale-105 transition-transform`}>{message.status}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="block text-center text-[#F44C27] text-xs font-semibold py-2 hover:underline bg-[#F6F8FA]">Voir tous les messages</a>
              </div>
            )}
          </div>
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-[#F44C27]/50"
              onClick={() => setNotificationsOpen((v) => !v)}
              aria-label="Voir les notifications"
            >
              <Bell className="text-[#003399] w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">{notificationsDemo.length}</span>
            </button>
            {notificationsOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-[#F44C27]/10">
                <div className="px-4 py-2 border-b font-bold text-[#181F2B] bg-[#F6F8FA] text-sm">Notifications</div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {notificationsDemo.map((notif, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-[#F6F8FA] transition group cursor-pointer"
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${notif.status === 'En Cours' ? 'bg-green-400' : notif.status === 'Prêt À Retirer' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                      <div className="flex-1 text-xs text-[#181F2B] leading-snug">
                        {notif.text}
                      </div>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-sm border ${notif.status === 'En Cours' ? 'bg-green-50 text-green-700 border-green-100' : notif.status === 'Prêt À Retirer' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'} group-hover:scale-105 transition-transform`}>{notif.status}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" className="block text-center text-[#F44C27] text-xs font-semibold py-2 hover:underline bg-[#F6F8FA]">Voir toutes les notifications</a>
              </div>
            )}
          </div>
          {/* Profil */}
          <button className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full">
            <ChevronDown className="text-white w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
} 