"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createDemande } from "@/src/actions/demande-request.action";

export default function ProcurationForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();

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
    { type: "text" as const, name: "mandataire", label: "Nom du mandataire", placeholder: "Nom du mandataire" },
    { type: "text" as const, name: "mandatairePiece", label: "Pièce justificative du mandataire", placeholder: "Pièce justificative du mandataire" },
    { type: "text" as const, name: "mandataireContact", label: "Contact du mandataire", placeholder: "Contact du mandataire" },
    { type: "text" as const, name: "objet", label: "Objet de la procuration", placeholder: "Objet de la procuration" },
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
      type: "POWER_OF_ATTORNEY",
      details,
      contactPhoneNumber: formData.get("mandataireContact") as string,
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
          title="Formulaire de demande de procuration"
          logoSrc="/assets/images/illustrations/formulaire/logo.png"
          fields={fields}
          buttons={[]}
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
        title="Formulaire de demande de procuration"
        documentsLabel="Documents à fournir :"
        conditionsList={[
          // À compléter par l'utilisateur
          'Copie de la pièce d\'identité du mandant',
          'Copie de la pièce d\'identité du mandataire',
          'Lettre de procuration signée',
        ]}
      />
    </>
  );
} 
