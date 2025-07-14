"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";

export default function ConsulaireCardForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }
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
    { type: "text" as const, name: "pieceNumber", label: "Numéro de pièce justificative", placeholder: "Numéro de pièce justificative" },
    { type: "text" as const, name: "tchadAddress", label: "Adresse au Tchad", placeholder: "Adresse au Tchad" },
    { type: "text" as const, name: "pieceType", label: "Pièce justificative", placeholder: "Pièce justificative" },
    { type: "text" as const, name: "contact", label: "Contact", placeholder: "Contact" },
  ];

  return (
    <>
      <form className="w-full">
        <FormulaireGenerique
          title="Formulaire de carte consulaire"
          logoSrc="/assets/images/illustrations/formulaire/logo.png"
          fields={fields}
          buttons={[]}
          onSubmit={() => {}}
        />
        {/* Section pièces à fournir */}
        <div className="mb-4 ml-16">
          <div className="font-semibold text-gray-700 dark:text-white mb-1">Pièces à fournir</div>
          <div className="text-xs text-gray-400 mb-2">Importez jusqu&apos;à 10 fichiers compatibles. 100 MB max. par fichier.</div>
          <div className="w-72 border-2 border-[#003399] rounded-full hover:bg-blue-50">
            <label className="flex items-center gap-2 px-4 py-2 text-[#003399] cursor-pointer w-full justify-start">
              <ArrowUpFromLine size={20} />
              <span className="text-left">Ajouter un fichier</span>
              <input type="file" multiple className="hidden" onChange={handleFilesChange} />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">{files.length} fichier(s) sélectionné(s)</div>
          )}
        </div>
        {/* Boutons d'action tout en bas */}
        <div className="flex justify-between mt-8">
          <button 
            type="button"
            onClick={() => setIsConditionsModalOpen(true)}
            className="bg-transparent text-[#F44C27] border border-[#F44C27] px-6 py-2 rounded-full font-semibold hover:bg-[#fff0ed] transition"
          >
            Voir les conditions
          </button>
          <button type="submit" className="bg-[#F44C27] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#e13a1a] transition">Envoyer</button>
        </div>
      </form>

      {/* Modal des conditions */}
      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        title="Formulaire de carte consulaire"
        documentsLabel="Documents à fournir :"
        conditionsList={[
          'Acte de Naissance',
          'copie de passeport',
          '2 photos d’identité',
        ]}
      />
    </>
  );
} 