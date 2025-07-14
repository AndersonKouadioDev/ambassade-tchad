import React from "react";
import ProgressSteps from '@/components/espace-client/ProgressSteps';
import DocumentsSection from '@/components/espace-client/DocumentsSection';
import DemandeDetailsSection from '@/components/espace-client/DemandeDetailsSection';
import DemandeTable from '@/components/espace-client/DemandeTable';
import HistoriqueTraitement from '@/components/espace-client/HistoriqueTraitement';

export default function DemandeDetail() {
  const demande = {
    ticket: "T001",
    service: "Visa",
    dateSoumission: "02 / 07 / 2025",
    status: "Nouveau",
    montant: "",
    dateDelivrance: "",
  };
  const steps = [
    { label: "Nouveau", date: "03/07/2025", done: true },
    { label: "En cours", date: "05/07/2025", done: false },
    { label: "En attente", date: "-", done: false },
    { label: "Prêt à retirer", date: "-", done: false },
    { label: "Terminé", date: "-", done: false },
    { label: "Clôturé", date: "-", done: false },
  ];
  const progression = Math.round((steps.filter(s => s.done).length - 1) / (steps.length - 1) * 100);
  const progressLabels = [
    <div key="detail">
      <div>Date & Heure : {steps[0].date}</div>
      <div>Statut : {steps[0].label}</div>
      <div>Commentaire :  </div>
    </div>,
    <span key="proc">Processus de traitement</span>,
    ...steps.slice(2).map((s, idx) => <span key={idx + 2}>{s.label}</span>)
  ];
  return (
    <div className="bg-[#F6F8FA] dark:bg-gray-900 min-h-screen w-full p-4 md:p-8">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-[#181F2B] dark:text-white mb-1">Suivi de la Demande N° {demande.ticket}</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">Retrouvez ici l&apos;historique et le statut de toutes vos demandes auprès de l&apos;Ambassade du Tchad.</p>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-0 md:p-8 mb-8">
          <div className="text-xl font-bold text-[#181F2B] dark:text-white mb-4 px-4 pt-4">Listes des demandes</div>
          <DemandeTable demande={demande} />
          <HistoriqueTraitement steps={steps} progression={progression} />
          <div className="w-full flex justify-center">
            <ProgressSteps percent={progression} steps={steps.length} labels={progressLabels} />
          </div>
        </div>
        <DocumentsSection />
        <DemandeDetailsSection />
      </div>
    </div>
  );
} 