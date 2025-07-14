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
    <>
      <DashboardHeader />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="col-span-3"><RequestsTablePro /></div>
        <div className="col-span-2"><NewsCarouselPro /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="col-span-3 flex flex-col gap-6 mt-8">
         
          <Notifications notifications={notifications} />
        </div>
        <div className="col-span-2 flex flex-col gap-6 mt-8">
          <QuickActions />
        </div>
      </div>
    </>
  );
} 