import { Metadata } from 'next';
import RequestTrackingSystem from '@/components/espace-client/RequestTrackingSystem';

export const metadata: Metadata = {
  title: 'Suivi de demande | Ambassade du Tchad',
  description: 'Suivez l\'état de votre demande consulaire en temps réel',
};

export default function SuiviDemandePage() {
  return <RequestTrackingSystem />;
}
