import ClientLayout from '@/components/espace-client/ClientLayout';
import AuthProtection from '@/feature/auth/components/AuthProtection';

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProtection>
      <ClientLayout>
        {children}
      </ClientLayout>
    </AuthProtection>
  );
} 