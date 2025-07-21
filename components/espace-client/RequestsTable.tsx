import { useLocale } from 'next-intl';

interface Request {
  ticket: string;
  service: string;
  date: string;
  status: string;
}

interface RequestsTableProps {
  requests: Request[];
}

const statusColors: Record<string, string> = {
  'Nouveau': 'bg-blue-100 text-blue-700',
  'En Cours': 'bg-yellow-100 text-yellow-700',
  'En Attente': 'bg-gray-100 text-gray-700',
  'Prêt À Retirer': 'bg-green-100 text-green-700',
};

export default function RequestsTable({ requests }: RequestsTableProps) {
  const locale = useLocale();
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="font-bold text-blue-900 mb-4">Mes demandes en cours</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2">N° Ticket</th>
            <th>Service concerné</th>
            <th>Date de soumission</th>
            <th>Statut actuel</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.ticket} className="border-b last:border-0">
              <td className="py-2 font-semibold">{req.ticket}</td>
              <td>{req.service}</td>
              <td>{req.date}</td>
              <td><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>{req.status}</span></td>
              <td><button className="px-3 py-1 rounded bg-red-50 text-red-600 font-semibold text-xs">Voir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right mt-2">
        <a href={`/${locale}/espace-client/mes-demandes`} className="text-blue-700 text-xs font-semibold hover:underline">Voir Toutes Les Demandes</a>
      </div>
    </div>
  );
} 