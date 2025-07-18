import Notifications from '@/components/espace-client/Notifications'; 
import QuickActions from '@/components/espace-client/QuickActions';
import DashboardHeader from '@/components/espace-client/DashboardHeader';
import RequestsTablePro from '@/components/espace-client/RequestsTablePro';
import NewsCarouselPro from '@/components/espace-client/NewsCarouselPro';

const notifications = [
  { text: 'Votre Demande De Visa Ticket N°T001 Est Passée Au Statut', status: 'En Cours' },
  { text: 'Documents Supplémentaires Nécessaire Pour Votre Demande De Visa Ticket N°T001 Est Passée Au Statut', status: 'Requis' },
  { text: 'Votre Visa Ticket N°T001 Est Prêt À Être Retiré À L\'ambassade Du Tchad.', status: 'Prêt À Retirer' },
];
 

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Section principale avec tableau et news */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Tableau des demandes - prend plus d'espace sur desktop */}
        <div className="xl:col-span-2 order-1">
          <RequestsTablePro />
        </div>
        
        {/* News carousel - stack sur mobile */}
        <div className="xl:col-span-1 order-2">
          <NewsCarouselPro />
        </div>
      </div>
      
      {/* Section notifications et actions rapides */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Notifications - plus large sur desktop */}
        <div className="xl:col-span-2 order-1">
          <Notifications notifications={notifications} />
        </div>
        
        {/* Actions rapides - sidebar sur desktop */}
        <div className="xl:col-span-1 order-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
} 