import ClientLayout from '@/components/espace-client/ClientLayout';

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
} 