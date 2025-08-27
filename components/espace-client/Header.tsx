"use client";
import Image from "next/image";
import {Search, ChevronDown, Check } from "lucide-react";
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

  // États séparés pour mobile et desktop
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);

  const langButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangButtonRef = useRef<HTMLButtonElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);

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

  // Gestion des clics à l'extérieur pour desktop
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

  // Gestion des clics à l'extérieur pour mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileLangButtonRef.current &&
        !mobileLangButtonRef.current.contains(event.target as Node) &&
        mobileLangDropdownRef.current &&
        !mobileLangDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileLangDropdownOpen(false);
      }
    }
    if (mobileLangDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileLangDropdownOpen]);

  function handleLangSelect(lang: (typeof languages)[0]) {
    // Fermer les dropdowns
    setLangDropdownOpen(false);
    setMobileLangDropdownOpen(false);

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
            className="flex items-center justify-center bg-white  rounded-full p-2 shadow border border-slate-200 "
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
              ref={mobileLangButtonRef}
              className="relative size-8 flex items-center gap-1 bg-transparent px-1 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              onClick={() => setMobileLangDropdownOpen((v) => !v)}
              aria-label="Changer de langue"
            >
              <Image
                src={`/assets/flags/${currentLang.flag}`}
                alt={currentLang.label}
                fill
                className="rounded-full"
              />
            </button>
            {mobileLangDropdownOpen && (
              <div
                ref={mobileLangDropdownRef}
                className="fixed top-14 right-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[10050] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10 min-w-[140px]"
              >
                {languages.map((lang, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors w-full text-left relative
                      ${
                        currentLang.code === lang.code
                          ? "bg-gray-50 font-bold text-blue-800"
                          : "hover:bg-gray-50 text-gray-900"
                      }`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    <Image
                      src={`/assets/flags/${lang.flag}`}
                      alt={lang.label}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="flex-1 text-gray-900">{lang.label}</span>
                    {currentLang.code === lang.code && (
                      <Check className="w-4 h-4 text-blue-800 absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop*/}
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
          {/* Langue - Dropdown Desktop */}
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
              <span className="text-white font-semibold text-sm">
                {currentLang.label.toUpperCase()}
              </span>
              <ChevronDown className="text-white w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div
                ref={langDropdownRef}
                className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[10050] animate-fade-in flex flex-col overflow-hidden ring-1 ring-orange-500/10 min-w-[140px]"
                style={{
                  top: dropdownPosition.top + 8,
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
                          ? "bg-gray-50 font-bold text-blue-800"
                          : "hover:bg-gray-50 text-gray-900"
                      }`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    <Image
                      src={`/assets/flags/${lang.flag}`}
                      alt={lang.label}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="flex-1 text-gray-900">{lang.label}</span>
                    {currentLang.code === lang.code && (
                      <Check className="w-4 h-4 text-blue-800 absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
