"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Download, FileText, Image, File } from "lucide-react";
import {
  VisaRequestDetails,
  BirthActRequestDetails,
  ConsularCardRequestDetails,
  DeathActRequestDetails,
  MarriageCapacityActRequestDetails,
  NationalityCertificateRequestDetails,
  PowerOfAttorneyRequestDetails,
  LaissezPasserFormInput,
} from "@/lib/validation/details-request.validation";

interface Document {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface DemandeDetail {
  id: string;
  ticketNumber: string;
  userId: string;
  serviceType: string;
  status: string;
  submissionDate: string;
  updatedAt: string;
  completionDate: string | null;
  issuedDate: string | null;
  contactPhoneNumber: string;
  observations: string | null;
  amount: number;
  documents: Document[];
  visaDetails: VisaRequestDetails;
  birthActDetails: BirthActRequestDetails;
  consularCardDetails: ConsularCardRequestDetails;
  laissezPasserDetails: LaissezPasserFormInput;
  marriageCapacityActDetails: MarriageCapacityActRequestDetails;
  deathActDetails: DeathActRequestDetails;
  powerOfAttorneyDetails: PowerOfAttorneyRequestDetails;
  nationalityCertificateDetails: NationalityCertificateRequestDetails;
}

export default function DemandeDetail() {
  console.log("DemandeDetail component loaded"); // Debug: vérifier si le composant se charge
  const t = useTranslations("espaceClient");
  const params = useParams();
  const { data: session } = useSession();
  const [demande, setDemande] = useState<DemandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const demandeId = params.demandeId as string;
  console.log("DemandeId:", demandeId); // Debug: vérifier l'ID de la demande
  console.log("Session:", session); // Debug: vérifier la session

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      if (!session || !demandeId) {
        setLoading(false);
        setError("Session ou ID de demande manquant");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        if (session.user?.token) {
          headers["Authorization"] = `Bearer ${session.user.token}`;
        }

        const res = await fetch(
          `http://localhost:8081/api/v1/demandes/${demandeId}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Erreur ${res.status}: ${
              errorText || "Erreur lors du chargement de la demande"
            }`
          );
        }

        const data = await res.json();
        console.log("API Response:", data); // Debug: voir la structure complète
        console.log("Documents field:", data.documents); // Debug: voir le champ documents
        console.log("Files field:", data.files); // Debug: voir si c'est 'files' au lieu de 'documents'
        console.log("Attachments field:", data.attachments); // Debug: voir si c'est 'attachments'
        console.log("All keys:", Object.keys(data)); // Debug: voir toutes les clés disponibles

        // Vérifier différents noms possibles pour les documents
        if (data.files && !data.documents) {
          data.documents = data.files;
        } else if (data.attachments && !data.documents) {
          data.documents = data.attachments;
        }

        setDemande(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Erreur inconnue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDemandeDetail();
  }, [session, demandeId]);

  const translateServiceType = (serviceType: string) => {
    const translations: Record<string, string> = {
      CONSULAR_CARD: "Carte Consulaire",
      POWER_OF_ATTORNEY: "Procuration",
      MARRIAGE_CAPACITY_ACT: "Acte de Capacité de Mariage",
      LAISSEZ_PASSER: "Laissez-passer",
      DEATH_ACT_APPLICATION: "Acte de Décès",
      NATIONALITY_CERTIFICATE: "Certificat de Nationalité",
      BIRTH_ACT_APPLICATION: "Acte de Naissance",
      VISA: "Visa",
    };
    return translations[serviceType] || serviceType;
  };

  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      NEW: "Nouveau",
      IN_PROGRESS: "En cours",
      PENDING: "En attente",
      COMPLETED: "Terminé",
      READY_TO_PICKUP: "Prêt à retirer",
      REJECTED: "Rejeté",
    };
    return translations[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-700",
      IN_PROGRESS: "bg-yellow-100 text-yellow-700",
      PENDING: "bg-orange-100 text-orange-700",
      COMPLETED: "bg-green-100 text-green-700",
      READY_TO_PICKUP: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image height={20} width={20} className="w-5 h-5 text-blue-500" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      await fetch(document.url, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const renderDocumentsSection = () => {
    console.log("Demande object:", demande); // Debug: voir l'objet demande
    console.log("Documents array:", demande?.documents); // Debug: voir le tableau documents
    console.log("Documents length:", demande?.documents?.length); // Debug: voir la longueur

    if (!demande?.documents || demande.documents.length === 0) {
      console.log("No documents found, showing empty state"); // Debug: voir si on affiche l'état vide
      return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("mesDemandesClient.documents.title")}
          </h2>
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              {t("mesDemandesClient.documents.aucunDocument")}
            </p>
          </div>
        </div>
      );
    }

    console.log(
      "Rendering documents section with",
      demande.documents.length,
      "documents"
    ); // Debug: voir si on rend la section
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t("mesDemandesClient.documents.title")} ({demande.documents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demande.documents.map((document) => (
            <div
              key={document.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(document.mimeType)}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-900 truncate"
                      title={document.originalName}
                    >
                      {document.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.size)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>
                  {t("mesDemandesClient.documents.uploadedOn")}{" "}
                  {new Date(document.uploadedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <button
                onClick={() => handleDownload(document)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t("mesDemandesClient.documents.telecharger")}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisaDetails = (details: VisaRequestDetails) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Détails du Visa</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <p className="text-gray-900">
              {details.personFirstName} {details.personLastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <p className="text-gray-900">
              {new Date(details.personBirthDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationalité
            </label>
            <p className="text-gray-900">{details.personNationality}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type de visa
            </label>
            <p className="text-gray-900">{details.visaType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de passeport
            </label>
            <p className="text-gray-900">{details.passportNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <p className="text-gray-900">
              {details.profession ||
                t("mesDemandesClient.documents.nonSpecifie")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderConsularCardDetails = (details: ConsularCardRequestDetails) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">
          Détails de la Carte Consulaire
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <p className="text-gray-900">
              {details.personFirstName} {details.personLastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <p className="text-gray-900">
              {new Date(details.personBirthDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationalité
            </label>
            <p className="text-gray-900">{details.personNationality}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <p className="text-gray-900">
              {details.personProfession ||
                t("mesDemandesClient.documents.nonSpecifie")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderLaissezPasserDetails = (details: LaissezPasserFormInput) => {
    if (!details) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">
          Détails du Laissez-passer
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <p className="text-gray-900">
              {details.personFirstName} {details.personLastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <p className="text-gray-900">
              {new Date(details.personBirthDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <p className="text-gray-900">{details.destination}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Raison du voyage
            </label>
            <p className="text-gray-900">{details.travelReason}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Accompagné
            </label>
            <p className="text-gray-900">
              {details.accompanied ? "Oui" : "Non"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Chargement des détails de la demande...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Demande non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Demande {demande.ticketNumber}
              </h1>
              <p className="text-gray-600">
                {translateServiceType(demande.serviceType)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  demande.status
                )}`}
              >
                {translateStatus(demande.status)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Montant: {demande.amount.toLocaleString()} FCFA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date de soumission
              </label>
              <p className="text-gray-900">
                {new Date(demande.submissionDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dernière mise à jour
              </label>
              <p className="text-gray-900">
                {new Date(demande.updatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <p className="text-gray-900">{demande.contactPhoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Détails spécifiques selon le type de service */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Détails de la demande
          </h2>

          {demande.visaDetails && renderVisaDetails(demande.visaDetails)}
          {demande.consularCardDetails &&
            renderConsularCardDetails(demande.consularCardDetails)}
          {demande.laissezPasserDetails &&
            renderLaissezPasserDetails(demande.laissezPasserDetails)}

          {/* Ajouter d'autres types de détails selon les besoins */}

          {demande.observations && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observations
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {demande.observations}
              </p>
            </div>
          )}
        </div>

        {/* Section Documents */}
        {renderDocumentsSection()}

        {/* Section Debug temporaire */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Debug - Données brutes
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(demande, null, 2)}
            </pre>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            ← Retour aux demandes
          </button>
        </div>
      </div>
    </div>
  );
}
