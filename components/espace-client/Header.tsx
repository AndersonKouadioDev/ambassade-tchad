"use client";
import Image from "next/image";
import { Mail, Bell, Search, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import NotificationsModal from "./NotificationsModal";
import MessagesModal from "./MessagesModal";

const initialNotifications = [
  {
    id: "n1",
    text: "Votre Demande De Visa Ticket N°T001 Est Passée Au Statut",
    status: "enCours" as const,
    read: false,
    date: "2025-07-17",
  },
  {
    id: "n2",
    text: "Documents Supplémentaires Nécessaire Pour Votre Demande De Visa Ticket N°T001 Est Passée Au Statut",
    status: "requis" as const,
    read: true,
    date: "2025-07-16",
  },
  {
    id: "n3",
    text: "Votre Visa Ticket N°T001 Est Prêt À Être Retiré À L'ambassade Du Tchad.",
    status: "pretARetirer" as const,
    read: false,
    date: "2025-07-15",
  },
];

const messagesDemo = [
  {
    id: "m1",
    subject: "Approbation de visa",
    content:
      "Votre demande de visa a été approuvée. Veuillez vous présenter à l'ambassade avec les documents requis.",
    sender: "Service Consulaire",
    date: "Aujourd'hui",
    read: false,
    priority: "high" as const,
  },
  {
    id: "m2",
    subject: "Documents supplémentaires",
    content:
      "Documents supplémentaires requis pour votre dossier. Merci de les fournir dans les plus brefs délais.",
    sender: "Service Immigration",
    date: "Hier",
    read: true,
    priority: "medium" as const,
  },
  {
    id: "m3",
    subject: "Confirmation de rendez-vous",
    content:
      "Confirmation de votre rendez-vous pour le 15 décembre à 14h00. Merci d'arriver 15 minutes à l'avance.",
    sender: "Service Rendez-vous",
    date: "Il y a 2 jours",
    read: true,
    priority: "low" as const,
  },
  {
    id: "m4",
    subject: "Passeport prêt",
    content:
      "Votre passeport est prêt à être retiré. Les heures d'ouverture sont de 9h à 16h du lundi au vendredi.",
    sender: "Service Passeport",
    date: "Il y a 3 jours",
    read: false,
    priority: "high" as const,
  },
];

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export default function Header({ setSidebarOpen }: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations("espaceClient.header");
  const router = useRouter();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [messages, setMessages] = useState(messagesDemo);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleNotificationMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleNotificationMarkAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  const handleMessageMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const handleMessageMarkAsUnread = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: false } : msg))
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        messagesRef.current &&
        !messagesRef.current.contains(event.target as Node)
      ) {
        setMessagesOpen(false);
      }
    }
    if (notificationsOpen || messagesOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen, messagesOpen]);

  const languages = [
    { code: "fr", label: "Français", flag: "fr.png" },
    { code: "en", label: "English", flag: "en.svg" },
    { code: "ar", label: "العربية", flag: "ar.png" },
  ];

  const currentLang =
    languages.find((lang) => lang.code === locale) || languages[0];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

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
      if (
        langButtonRef.current &&
        !langButtonRef.current.contains(event.target as Node) &&
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langDropdownOpen]);

  function handleLangSelect(lang: (typeof languages)[0]) {
    // Fermer le dropdown avec un petit délai pour permettre l'interaction
    setTimeout(() => {
      setLangDropdownOpen(false);
    }, 100);

    if (lang.code !== locale) {
      const segments = pathname.split("/");
      segments[1] = lang.code;
      const newPathname = segments.join("/");

      router.push(newPathname);
    }
  }

  return (
    <header className="h-12 sm:h-14 bg-blue-800 border-r-blue-900 border-r-2 flex items-center px-2 sm:px-6 justify-between w-full gap-2 sm:gap-4 overflow-x-hidden flex-shrink-0">
      {/* Mobile : trigger, notifications, profil */}
      <div className="flex items-center w-full justify-between sm:hidden">
        <div className="block sm:hidden">
          <button
            className="flex items-center justify-center bg-white dark:bg-blue-900 rounded-full p-2 shadow border border-slate-200 dark:border-blue-800"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Image
              src="/assets/icons/sidebar-trigger.png"
              alt="Ouvrir le menu"
              width={24}
              height={24}
              priority
            />
          </button>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          {/* Langue - Mobile */}
          <div className="relative">
            <button
              className="flex items-center gap-1 bg-transparent px-1 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setLangDropdownOpen((v) => !v)}
              aria-label="Changer de langue"
            >
              <Image
                src={`/assets/flags/${currentLang.flag}`}
                alt={currentLang.label}
                width={34}
                height={34}
                className="rounded-full"
              />
            </button>
            {langDropdownOpen && (
              <div className="fixed top-14 right-2 bg-white dark:bg-blue-900 rounded-xl shadow-2xl border border-gray-100 dark:border-blue-800 z-[10050] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10 min-w-[140px]">
                {languages.map((lang, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors w-full text-left relative
                      ${
                        currentLang.code === lang.code
                          ? "bg-gray-50 dark:bg-blue-800 font-bold text-blue-800 dark:text-white"
                          : "hover:bg-gray-50 dark:hover:bg-blue-800 text-gray-900 dark:text-white"
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLangSelect(lang);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Image
                      src={`/assets/flags/${lang.flag}`}
                      alt={lang.label}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="flex-1 text-gray-900 dark:text-white">
                      {lang.label}
                    </span>
                    {currentLang.code === lang.code && (
                      <Check className="w-4 h-4 text-blue-800 dark:text-white absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages - Mobile */}
          <div className="relative" ref={messagesRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setMessagesOpen((v) => !v)}
              aria-label="Voir les messages"
            >
              <Mail className="text-blue-800 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {messages.filter((m) => !m.read).length}
              </span>
            </button>
            {messagesOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10">
                <div className="px-4 py-2 border-b font-bold text-gray-900 bg-gray-50 text-sm">
                  {t("messages")}
                </div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {messages.slice(0, 4).map((message, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        if (!message.read) handleMessageMarkAsRead(message.id);
                        setMessagesOpen(false);
                        setMessagesModalOpen(true);
                      }}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition group cursor-pointer"
                    >
                      <span
                        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${
                          message.priority === "high"
                            ? "bg-red-400"
                            : message.priority === "medium"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 leading-snug">
                          {message.sender}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {message.date}
                        </div>
                        <div className="text-xs text-gray-900 leading-snug mt-1 line-clamp-2 font-medium">
                          {message.subject}
                        </div>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setMessagesModalOpen(true);
                    setMessagesOpen(false);
                  }}
                  className="block w-full text-center text-orange-500 text-xs font-semibold py-2 hover:underline bg-gray-50"
                >
                  {t("viewAllMessages")}
                </button>
              </div>
            )}
          </div>

          {/* Notifications - Mobile */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setNotificationsOpen((v) => !v)}
              aria-label="Voir les notifications"
            >
              <Bell className="text-blue-800 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {notifications.filter((n) => !n.read).length}
              </span>
            </button>
            {notificationsOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10">
                <div className="px-4 py-2 border-b font-bold text-gray-900 bg-gray-50 text-sm">
                  {t("notifications")}
                </div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {notifications.map((notif, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        if (!notif.read) handleNotificationMarkAsRead(notif.id);
                        setNotificationsOpen(false);
                        setNotificationsModalOpen(true);
                      }}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition group cursor-pointer"
                    >
                      <span
                        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${
                          notif.status === "enCours"
                            ? "bg-green-400"
                            : notif.status === "pretARetirer"
                            ? "bg-blue-400"
                            : "bg-yellow-400"
                        }`}
                      ></span>
                      <div className="flex-1 text-xs text-gray-900 leading-snug">
                        {notif.text}
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setNotificationsModalOpen(true);
                    setNotificationsOpen(false);
                  }}
                  className="block w-full text-center text-orange-500 text-xs font-semibold py-2 hover:underline bg-gray-50"
                >
                  {t("viewAllNotifications")}
                </button>
              </div>
            )}
          </div>

          {/* Profil - Mobile */}
          <button className="flex items-center gap-1 bg-transparent px-1 py-1 rounded-full">
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
              placeholder={t("searchPlaceholder")}
              className="bg-transparent border-0 outline-none text-white placeholder-white/60 text-base w-full max-w-xs"
              style={{ letterSpacing: "0.01em" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Langue - Dropdown */}
          <div className="relative">
            <button
              ref={langButtonRef}
              className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setLangDropdownOpen((v) => !v)}
              aria-label="Changer de langue"
            >
              <Image
                src={`/assets/flags/${currentLang.flag}`}
                alt={currentLang.label}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-white dark:text-white font-semibold text-sm">
                {currentLang.label.toUpperCase()}
              </span>
              <ChevronDown className="text-white   w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div
                ref={langDropdownRef}
                className="fixed bg-white dark:bg-blue-900 rounded-xl shadow-2xl border border-gray-100 dark:border-blue-800 z-[10050] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10"
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
                      ${
                        currentLang.code === lang.code
                          ? "bg-gray-50 dark:bg-blue-800 font-bold text-blue-800 dark:text-white"
                          : "hover:bg-gray-50 dark:hover:bg-blue-800 text-gray-900 dark:text-white"
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLangSelect(lang);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Image
                      src={`/assets/flags/${lang.flag}`}
                      alt={lang.label}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="flex-1 text-gray-900 dark:text-white">
                      {lang.label}
                    </span>
                    {currentLang.code === lang.code && (
                      <Check className="w-4 h-4 text-blue-800 dark:text-white absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Thème */}
          {/* <button 
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
          >
            {theme === 'light' ? (
              <Moon className="text-blue-800 w-5 h-5" />
            ) : (
              <Sun className="text-blue-800 w-5 h-5" />
            )}
          </button> */}
          {/* Messages */}
          <div className="relative" ref={messagesRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setMessagesOpen((v) => !v)}
              aria-label="Voir les messages"
            >
              <Mail className="text-blue-800 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {messages.filter((m) => !m.read).length}
              </span>
            </button>
            {messagesOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10">
                <div className="px-4 py-2 border-b font-bold text-gray-900 bg-gray-50 text-sm">
                  {t("messages")}
                </div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {messages.slice(0, 4).map((message, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        if (!message.read) handleMessageMarkAsRead(message.id);
                        setMessagesOpen(false);
                        setMessagesModalOpen(true);
                      }}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition group cursor-pointer"
                    >
                      <span
                        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${
                          message.priority === "high"
                            ? "bg-red-400"
                            : message.priority === "medium"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 leading-snug">
                          {message.sender}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {message.date}
                        </div>
                        <div className="text-xs text-gray-900 leading-snug mt-1 line-clamp-2 font-medium">
                          {message.subject}
                        </div>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setMessagesModalOpen(true);
                    setMessagesOpen(false);
                  }}
                  className="block w-full text-center text-orange-500 text-xs font-semibold py-2 hover:underline bg-gray-50"
                >
                  {t("viewAllMessages")}
                </button>
              </div>
            )}
          </div>
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setNotificationsOpen((v) => !v)}
              aria-label="Voir les notifications"
            >
              <Bell className="text-blue-800 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                {notifications.filter((n) => !n.read).length}
              </span>
            </button>
            {notificationsOpen && (
              <div className="fixed top-14 sm:top-16 right-2 sm:right-6 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10">
                <div className="px-4 py-2 border-b font-bold text-gray-900 bg-gray-50 text-sm">
                  {t("notifications")}
                </div>
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                  {notifications.map((notif, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        if (!notif.read) handleNotificationMarkAsRead(notif.id);
                        setNotificationsOpen(false);
                        setNotificationsModalOpen(true);
                      }}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition group cursor-pointer"
                    >
                      <span
                        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow ${
                          notif.status === "enCours"
                            ? "bg-green-400"
                            : notif.status === "pretARetirer"
                            ? "bg-blue-400"
                            : "bg-yellow-400"
                        }`}
                      ></span>
                      <div className="flex-1 text-xs text-gray-900 leading-snug">
                        {notif.text}
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setNotificationsModalOpen(true);
                    setNotificationsOpen(false);
                  }}
                  className="block w-full text-center text-orange-500 text-xs font-semibold py-2 hover:underline bg-gray-50"
                >
                  {t("viewAllNotifications")}
                </button>
              </div>
            )}
          </div>
          {/* Profil */}
          <button className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full">
            <ChevronDown className="text-white w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleNotificationMarkAsRead}
        onMarkAsUnread={handleNotificationMarkAsUnread}
      />

      <MessagesModal
        isOpen={messagesModalOpen}
        onClose={() => setMessagesModalOpen(false)}
        messages={messages}
        onMarkAsRead={handleMessageMarkAsRead}
        onMarkAsUnread={handleMessageMarkAsUnread}
      />
    </header>
  );
}
