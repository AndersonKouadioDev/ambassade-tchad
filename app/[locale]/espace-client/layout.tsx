import ClientLayout from '@/components/espace-client/ClientLayout';
import AuthProtection from '@/features/auth/components/AuthProtection';

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProtection>
      <ClientLayout>
        {children}
      </ClientLayout>
    </AuthProtection>
  );
} 