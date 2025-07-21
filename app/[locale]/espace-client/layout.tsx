import ClientLayout from '@/components/espace-client/ClientLayout';
import { AuthTokenSync } from '@/components/AuthTokenSync';
import AuthProtection from '@/components/auth/AuthProtection';

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProtection>
      <ClientLayout>
        <AuthTokenSync />
        {children}
      </ClientLayout>
    </AuthProtection>
  );
} 