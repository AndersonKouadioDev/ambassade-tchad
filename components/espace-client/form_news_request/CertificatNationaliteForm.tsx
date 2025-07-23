"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";

export default function CertificatNationaliteForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
  // Champs principaux pour le certificat de nationalité
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
    { type: "text" as const, name: "fatherName", label: "Nom du père", placeholder: "Nom du père" },
    { type: "text" as const, name: "motherName", label: "Nom de la mère", placeholder: "Nom de la mère" },
    { type: "text" as const, name: "profession", label: "Profession", placeholder: "Profession" },
    { type: "text" as const, name: "address", label: "Domicile", placeholder: "Domicile" },
    { type: "textarea" as const, name: "motif", label: "Motif de la demande", placeholder: "Motif de la demande", className: "min-h-[80px]" },
    { type: "text" as const, name: "contact", label: "Contact", placeholder: "Contact" },
  ];

  return (
    <>
      <form className="w-full">
        <FormulaireGenerique
          title="Formulaire de demande de Certificat de nationalité"
          logoSrc="/assets/images/illustrations/formulaire/logo.png"
          fields={fields}
          buttons={[]}
          onSubmit={() => {}}
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
        title="Formulaire de demande de Certificat de nationalité"
        documentsLabel="Documents à fournir :"
        conditionsList={[
          "Copie intégrale de l'acte de naissance ou jugement supplétif",
          "Copie de la carte d'identité nationale ou du passeport (si disponible)",
          "Justificatif de domicile",
          "2 photos d'identité récentes",
          "Copie de l'acte de naissance du père ou de la mère (si possible)",
          "Tout document prouvant la nationalité tchadienne (si disponible)"
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