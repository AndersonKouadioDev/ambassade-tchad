interface Notification {
  text: string;
  status: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

const notifColors: Record<string, string> = {
  'En Cours': 'bg-green-100 text-green-700',
  'Requis': 'bg-yellow-100 text-yellow-700',
  'Prêt À Retirer': 'bg-blue-100 text-blue-700',
};

export default function Notifications({ notifications }: NotificationsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6 mb-6">
      <div className="font-bold text-black dark:text-white text-base md:text-lg mb-2 md:mb-4">Notifications</div>
      {/* Table sur sm+ */}
      <div className="hidden sm:block overflow-x-auto -mx-2 md:-mx-4">
        <table className="w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-[#E9EDF3] dark:bg-gray-700 text-[#181F2B] dark:text-gray-200 uppercase text-xs">
              <th className="py-2 md:py-2 px-2 md:px-6 font-semibold">Liste des dernières alertes et mises à jour importantes</th>
              <th className="py-2 md:py-2 px-2 md:px-6 font-semibold">Statut</th>
            </tr>
          </thead>
        <tbody>
          {notifications.map((notif, idx) => (
            <tr key={idx} className="border-b border-gray-200 dark:border-gray-600 last:border-0">
              <td className="py-2 md:py-4 px-2 md:px-6 text-[#181F2B] dark:text-gray-200">{notif.text}</td>
              <td className="py-2 md:py-4 px-2 md:px-6">
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${notifColors[notif.status] || 'bg-gray-100 text-gray-700'}`}>{notif.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {/* Cards sur mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {notifications.map((notif, idx) => (
          <div key={idx} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col gap-2 max-w-xs mx-auto w-full">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#181F2B] dark:text-white text-sm">Notification</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${notifColors[notif.status] || 'bg-gray-100 text-gray-700'}`}>{notif.status}</span>
            </div>
            <div className="text-xs text-[#181F2B] dark:text-gray-200">{notif.text}</div>
          </div>
        ))}
      </div>
      <div className="text-left md:text-right mt-2">
        <a href="#" className="text-[#F44C27] text-xs md:text-sm font-semibold hover:underline">Voir Toutes Les Notifications</a>
      </div>
    </div>
  );
} 