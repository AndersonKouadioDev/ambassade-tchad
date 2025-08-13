"use client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function DemandeNotFound({ requestType }: { requestType: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Type de demande non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Le type de demande &quot;{requestType}&quot; n&apos;existe pas.
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => router.push("/espace-client/nouvelle-demande")}
          >
            Retour à la sélection
          </button>
        </div>
      </div>
    </div>
  );
}
