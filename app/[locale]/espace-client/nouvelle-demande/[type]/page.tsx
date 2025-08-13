import ComingSoonForm from "@/components/espace-client/ComingSoonForm";
import { tousTypeDemandes } from "./data";
import { DemandeNotFound } from "@/components/espace-client/nouvelles-demande/demande-not-found";
import { DemandeHeader } from "@/components/espace-client/nouvelles-demande/demande-header";

export default async function NouvelleDemandeType({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const requestType = (await params).type as string;
  const requestConfig =
    tousTypeDemandes[requestType as keyof typeof tousTypeDemandes];

  if (!requestConfig) {
    return <DemandeNotFound requestType={requestType} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemandeHeader requestConfig={requestConfig} />

        {requestConfig.component ? (
          <requestConfig.component
            documentsSize={requestConfig.documents.length}
          />
        ) : (
          <ComingSoonForm
            title={requestConfig.title}
            description={requestConfig.description}
            processingTime={requestConfig.processingTime}
          />
        )}
      </div>
    </div>
  );
}
