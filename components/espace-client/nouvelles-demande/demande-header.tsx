"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export function DemandeHeader({
  requestConfig,
}: {
  requestConfig: {
    title: string;
    description: string;
    documents: string[];
    processingTime: string;
  };
}) {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {requestConfig.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {requestConfig.description}
          </p>
        </div>
      </div>
      {requestConfig.documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Documents requis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              {requestConfig.documents
                .slice(0, Math.ceil(requestConfig.documents.length / 2))
                .map((doc, index) => (
                  <li key={index}>• {doc}</li>
                ))}
            </ul>
            <ul className="space-y-2">
              {requestConfig.documents
                .slice(Math.ceil(requestConfig.documents.length / 2))
                .map((doc, index) => (
                  <li key={index}>• {doc}</li>
                ))}
            </ul>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Durée de traitement :</strong>{" "}
              {requestConfig.processingTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
