"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";

export default function PassportForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [tab, setTab] = useState<'ordinaire' | 'service'>('ordinaire');

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
    { type: "select" as const, name: "maritalStatus", label: "Situation familiale", options: [
      { value: "single", label: "Célibataire" },
      { value: "married", label: "Marié(e)" },
      { value: "divorced", label: "Divorcé(e)" },
      { value: "widowed", label: "Veuf/Veuve" }
    ] },
    { type: "text" as const, name: "passportType", label: "Type de passeport", placeholder: "Type de passeport" },
    { type: "text" as const, name: "passportNumber", label: "Numéro du passeport", placeholder: "Numéro du passeport" },
    { type: "text" as const, name: "issueDate", label: "Date de délivrance", placeholder: "Date de délivrance" },
    { type: "text" as const, name: "expiryDate", label: "Date d'expiration de la validité", placeholder: "Date d'expiration de la validité" },
    { type: "text" as const, name: "mainDestination", label: "Destination principale", placeholder: "Destination principale" },
    { type: "text" as const, name: "profession", label: "Profession", placeholder: "Profession" },
    { type: "text" as const, name: "employerAddress", label: "Adresse de l'employeur", placeholder: "Adresse de l'employeur" },
    { type: "text" as const, name: "employerPhone", label: "Numéro de téléphone de l'employeur", placeholder: "Numéro de téléphone de l'employeur" },
    { type: "text" as const, name: "visaType", label: "Type de Visa", placeholder: "Type de Visa" },
    { type: "text" as const, name: "duration", label: "Durée (mois)", placeholder: "Durée (mois)" },
    { type: "text" as const, name: "status", label: "État", placeholder: "État" },
    { type: "text" as const, name: "contact", label: "Contact", placeholder: "Contact" },
    { type: "textarea" as const, name: "observations", label: "Observations", placeholder: "Observations", className: "min-h-[80px]" },
  ];

  // Listes de documents pour chaque tab
  const docsOrdinaire = [
    'Formulaire de demande de visa dûment rempli',
    'copie de passeport',
    'passeport en cours de validité (6 mois minimum)',
    'Lettre d’invitation ou certificat d\'hébergement ou réservation d’hôtel',
    '2 photos d’identité',
  ];
  const docsService = [
    'Note verbale',
    'Formulaire de demande de visa dûment rempli',
    'copie de passeport',
    'passeport en cours de validité (6 mois minimum)',
    '2 photos d’identité',
  ];

  return (
    <>
      <form className="w-full">
        <FormulaireGenerique
          title="Formulaire de demande de Passeport"
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

      {/* Modal des conditions avec tabs */}
      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        title="Formulaire de demande de Passeport"
        documentsLabel="Documents à fournir :"
        conditionsList={tab === 'ordinaire' ? docsOrdinaire : docsService}
        extraNav={
          <div className="flex mb-4">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold text-sm focus:outline-none transition-all ${tab === 'ordinaire' ? 'bg-[#123682] text-white' : 'bg-gray-300 text-gray-600'}`}
              onClick={() => setTab('ordinaire')}
            >
              Passeport Ordinaire
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold text-sm focus:outline-none transition-all ${tab === 'service' ? 'bg-[#123682] text-white' : 'bg-gray-300 text-gray-600'}`}
              onClick={() => setTab('service')}
            >
              Passeport de Service ou Diplomatique
            </button>
          </div>
        }
      />
    </>
  );
} 