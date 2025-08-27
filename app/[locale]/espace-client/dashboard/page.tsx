import QuickActions from '@/components/espace-client/QuickActions';
import DashboardHeader from '@/components/espace-client/DashboardHeader';
import RequestsTablePro from '@/components/espace-client/RequestsTablePro';
import NewsCarouselPro from '@/components/espace-client/NewsCarouselPro';
import Notifications from '@/components/espace-client/Notifications';


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 order-1">
          <RequestsTablePro />
        </div>
        
        <div className="xl:col-span-1 order-2">
          <NewsCarouselPro />
        </div>
      </div>
      
      {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 ">
          <div className="xl:col-span-2 order-1">
            <Notifications notifications={[]} />
          </div>
        
        <div className="xl:col-span-1 order-2">
          <QuickActions />
        </div>
      </div> */}
    </div>
  );
} 