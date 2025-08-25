import ComingSoonForm from "@/components/espace-client/ComingSoonForm";
import { DemandeNotFound } from "@/components/espace-client/nouvelles-demande/demande-not-found";
import { DemandeHeader } from "@/components/espace-client/nouvelles-demande/demande-header";
import { getTranslations } from "next-intl/server";
import { DemandType, tousTypeDemandes } from "./data";

export default async function NouvelleDemandeType({
  params,
}: {
  params: Promise<{ type: string; locale: string }>;
}) {
  const { type, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DemandeTypes' });
  
  const requestType = type as DemandType;
  const requestConfig = tousTypeDemandes[requestType];

  if (!requestConfig) {
    return <DemandeNotFound requestType={requestType} />;
  }

  // Récupérer les textes traduits
  const title = t(`${requestConfig.key}.title`);
  const description = t(`${requestConfig.key}.description`);
  const processingTime = t(requestConfig.processingTimeKey);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemandeHeader 
          requestConfig={{
            title,
            description,
            documents: requestConfig.documents,
            processingTime,
          }}
        />

        {requestConfig.component ? (
          <requestConfig.component
            documentsSize={requestConfig.documents.length}
          />
        ) : (
          <ComingSoonForm
            title={title}
            description={description}
            processingTime={processingTime}
          />
        )}
      </div>
    </div>
  );
}