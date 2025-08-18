"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import NotificationsModal from "./NotificationsModal";
import { Button } from "@heroui/react";

interface Notification {
  id: string;
  text: string;
  status: "enCours" | "requis" | "pretARetirer";
  read: boolean;
  date: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

const notifColors: Record<string, string> = {
  enCours: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  requis:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  pretARetirer: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export default function Notifications({ notifications }: NotificationsProps) {
  const t = useTranslations("espaceClient.notifications");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);

  const handleMarkAsRead = (id: string) => {
    setNotifList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6 mb-6">
      <div className="font-bold text-black dark:text-white text-base md:text-lg mb-2 md:mb-4">
        {t("title")}
      </div>
      {/* Table sur sm+ */}
      <div className="hidden sm:block overflow-x-auto -mx-2 md:-mx-4">
        <table className="w-full text-xs md:text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 uppercase text-xs">
              <th className="py-2 md:py-2 px-2 md:px-6 font-semibold w-3/4 text-left">
                {t("listeAlertes")}
              </th>
              <th className="py-2 md:py-2 px-2 md:px-6 font-semibold w-1/4 text-center">
                {t("statut")}
              </th>
            </tr>
          </thead>
          <tbody>
            {notifList.slice(0, 5).map((notif, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 dark:border-gray-600 last:border-0"
              >
                <td className="py-2 md:py-4 px-2 md:px-6 text-gray-900 dark:text-gray-200 break-words">
                  {notif.text}
                </td>
                <td className="py-2 md:py-4 px-2 md:px-6 text-center">
                  <span
                    className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      notifColors[notif.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t(`status.${notif.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards sur mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {notifList.slice(0, 3).map((notif, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col gap-3 w-full"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-gray-900 dark:text-white text-sm flex-shrink-0">
                  {t("notification")}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    notifColors[notif.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t(`status.${notif.status}`)}
                </span>
              </div>
              <div className="text-xs text-gray-900 dark:text-gray-200 break-words leading-relaxed">
                {notif.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-left md:text-right mt-2">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="text-orange-500 text-xs md:text-sm font-semibold hover:underline transition"
        >
          {t("voirToutes")}
        </Button>
      </div>
      <NotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifList}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
      />
    </div>
  );
}
