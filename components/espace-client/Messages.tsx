interface Message {
  text: string;
  status: string;
  sender: string;
  date: string;
}

interface MessagesProps {
  messages: Message[];
}

const messageColors: Record<string, string> = {
  'Non Lu': 'bg-red-100 text-red-700',
  'Lu': 'bg-green-100 text-green-700',
  'Répondu': 'bg-blue-100 text-blue-700',
  'Important': 'bg-orange-100 text-orange-700',
};

export default function Messages({ messages }: MessagesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
      <div className="font-bold text-black dark:text-white text-lg mb-4">Messages</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#E9EDF3] dark:bg-gray-700 text-[#181F2B] dark:text-gray-200 uppercase text-xs">
            <th className="py-2 px-4 font-semibold text-left">Expéditeur</th>
            <th className="py-2 px-4 font-semibold text-left">Message</th>
            <th className="py-2 px-4 font-semibold text-left">Date</th>
            <th className="py-2 px-4 font-semibold text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, idx) => (
            <tr key={idx} className="border-b border-gray-200 dark:border-gray-600 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200 font-medium">{message.sender}</td>
              <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200 max-w-xs truncate">{message.text}</td>
              <td className="py-2 px-4 text-[#181F2B] dark:text-gray-200 text-xs">{message.date}</td>
              <td className="py-2 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${messageColors[message.status] || 'bg-gray-100 text-gray-700'}`}>{message.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right mt-2">
        <a href="#" className="text-[#F44C27] text-xs font-semibold hover:underline">Voir Tous Les Messages</a>
      </div>
    </div>
  );
} 