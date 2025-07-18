"use client";
import FormulaireGenerique from "@/components/ui/FormulaireGenerique";
import ConditionsModal from "@/components/ui/ConditionsModal";
import React, { useState } from "react";

export default function VisaForm() {
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  return (
    <>
    <FormulaireGenerique
      title="Formulaire de demande de visa"
      logoSrc="/assets/images/illustrations/formulaire/logo.png"
      fields={[
        { type: "file", name: "photo", label: "Photo", accept: "image/*" },
        { type: "text", name: "lastName", label: "Nom", placeholder: "Nom" },
        { type: "text", name: "firstName", label: "Prénom", placeholder: "Prénom" },
        { type: "text", name: "birthDate", label: "Date de naissance", placeholder: "Date de naissance" },
        { type: "text", name: "birthPlace", label: "Lieu de naissance", placeholder: "Lieu de naissance" },
        { type: "text", name: "nationality", label: "Nationalité", placeholder: "Nationalité" },
        { type: "select", name: "gender", label: "Sexe", options: [
          { value: "M", label: "Masculin" },
          { value: "F", label: "Féminin" }
        ] },
        { type: "select", name: "maritalStatus", label: "Situation familiale", options: [
          { value: "single", label: "Célibataire" },
          { value: "married", label: "Marié(e)" },
          { value: "divorced", label: "Divorcé(e)" },
          { value: "widowed", label: "Veuf/Veuve" }
        ] },
      ]}
      buttons={[
        { label: "Envoyer", type: "submit", variant: "primary" }
      ]}
      onSubmit={(values) => {
        console.log("Demande VISA:", values);
      }}
    />

      {/* Modal des conditions */}
      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        formType="visa"
      />
    </>
  );
} 