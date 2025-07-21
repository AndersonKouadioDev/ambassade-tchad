"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createDemande } from "@/src/actions/demande-request.action";

export default function LaissezPasserForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setIsUploadingFiles(true);
      setTimeout(() => {
        setFiles(Array.from(e.target.files!));
        setIsUploadingFiles(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 800);
    }
  }
  // Champs principaux
  const fields = [
    { type: "file" as const, name: "photo", label: "Photo", accept: "image/*" },
    { type: "text" as const, name: "lastName", label: "Nom", placeholder: "Nom" },
    { type: "text" as const, name: "firstName", label: "Prénom", placeholder: "Prénom" },
    { type: "text" as const, name: "birthDate", label: "Date de naissance", placeholder: "Date de naissance" },
    { type: "text" as const, name: "birthPlace", label: "Lieu de naissance", placeholder: "Lieu de naissance" },
    { type: "text" as const, name: "nationality", label: "Nationalité", placeholder: "Nationalité" },
    { type: "select" as const, name: "gender", label: "Sexe", options: [
      { value: "M", label: "Masculin" },
      { value: "F", label: "Féminin" }
    ] },
    { type: "text" as const, name: "childOf", label: "Fils/Fille de", placeholder: "Fils/Fille de" },
    { type: "text" as const, name: "andOf", label: "Et de", placeholder: "Et de" },
    { type: "text" as const, name: "profession", label: "Profession", placeholder: "Profession" },
    { type: "text" as const, name: "address", label: "Domicile", placeholder: "Domicile" },
    { type: "text" as const, name: "destination", label: "Se rendant à", placeholder: "Se rendant à" },
    { type: "text" as const, name: "accompaniedBy", label: "Accompagné (e) de", placeholder: "Accompagné (e) de" },
    { type: "text" as const, name: "accompagnateur", label: "Le nom de l'accompagnateur(trice)", placeholder: "Le nom de l'accompagnateur(trice)" },
    { type: "textarea" as const, name: "motif", label: "Motif de voyage", placeholder: "Motif de voyage", className: "min-h-[80px]" },
    { type: "text" as const, name: "validUntil", label: "Valable jusqu'au", placeholder: "Valable jusqu'au" },
    { type: "text" as const, name: "pieceType", label: "Pièce justificative", placeholder: "Pièce justificative" },
    { type: "text" as const, name: "pieceNumber", label: "Numéro de pièce justificative", placeholder: "Numéro de pièce justificative" },
    { type: "text" as const, name: "contact", label: "Contact", placeholder: "Contact" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("documents", file));
    formData.append("locale", locale);

    const details: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type !== "file") {
        details[field.name] = formData.get(field.name);
      }
    });

    const result = await createDemande({
      type: "LAISSEZ_PASSER",
      details,
      contactPhoneNumber: formData.get("contact") as string,
      documents: files,
      locale,
      tokenFromClient: session?.user?.token,
    });

    if (result.success) {
      router.push(`/${locale}/espace-client/mes-demandes?success=true`);
    } else {
      alert(result.error || "Erreur lors de la création de la demande");
    }
  }

  return (
    <>
    <form className="w-full" onSubmit={handleSubmit}>
      <FormulaireGenerique
        title="Formulaire de demande de Laissez-passer"
        logoSrc="/assets/images/illustrations/formulaire/logo.png"
        fields={fields}
        buttons={[]}
      />
      {/* Section pièces à fournir */}
      <div className="mb-4 ml-16">
        <div className="font-semibold text-gray-700 dark:text-white mb-1">Pièces à fournir</div>
        <div className="text-xs text-gray-400 mb-2">Importez jusqu&apos;à 10 fichiers compatibles. 100 MB max. par fichier.</div>
          <div className="w-72 border-2 border-blue-800 rounded-full hover:bg-blue-50">
            <label className="flex items-center gap-2 px-4 py-2 text-blue-800 cursor-pointer w-full justify-start">
              {isUploadingFiles ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
              ) : (
                <ArrowUpFromLine size={20} />
              )}
              <span className="text-left">
                {isUploadingFiles ? 'Upload en cours...' : 'Ajouter un fichier'}
              </span>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFilesChange} 
                disabled={isUploadingFiles}
              />
            </label>
          </div>
        {files.length > 0 && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">{files.length} fichier(s) sélectionné(s)</div>
        )}
      </div>
      {/* Boutons d'action tout en bas */}
      <div className="flex justify-end mt-8">
        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-600 transition">Envoyer</button>
      </div>
    </form>

      {/* Modal des conditions */}
      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        title="Formulaire de demande de Laissez-passer"
        documentsLabel="Documents à fournir :"
        conditionsList={[
          'Ancien passeport/ Carte Consulaire',
          'Acte de naissance',
          '2 photos d’identité'
        ]}
      />
      {/* Toast de succès */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Fichiers uploadés avec succès !
          </div>
        </div>
      )}
    </>
  );
} 