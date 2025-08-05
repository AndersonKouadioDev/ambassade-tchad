import ClientLayout from '@/components/espace-client/ClientLayout';
import AuthTokenSync from '@/components/AuthTokenSync';
import AuthProtection from '@/feature/auth/components/AuthProtection';

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