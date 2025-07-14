"use client";
import Accordion from '@/components/espace-client/Accordion';
import NewsCarouselPro from '@/components/espace-client/NewsCarouselPro';
import QuickActions from '@/components/espace-client/QuickActions';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import VisaForm from '@/components/espace-client/VisaForm';
import ConsulaireCardForm from '@/components/espace-client/ConsulaireCardForm';
import LaissezPasserForm from '@/components/espace-client/LaissezPasserForm';
import PassportForm from '@/components/espace-client/PassportForm';
import ProcurationForm from '@/components/procuration/procuration';
import CertificatNationaliteForm from '@/components/espace-client/CertificatNationaliteForm';

export default function NouvelleDemande() {
  const [openVisaModal, setOpenVisaModal] = useState(false);
  const [openConsulaireModal, setOpenConsulaireModal] = useState(false);
  const [openLaissezPasserModal, setOpenLaissezPasserModal] = useState(false);
  const [openPassportModal, setOpenPassportModal] = useState(false);
  const [openProcurationModal, setOpenProcurationModal] = useState(false);
  const [openCertificatModal, setOpenCertificatModal] = useState(false);

  return (
    <div className="bg-[#F6F8FA] dark:bg-gray-900 min-h-screen w-full md:p-4">
      <Modal open={openVisaModal} onClose={() => setOpenVisaModal(false)} maxWidth="max-w-5xl">
        <VisaForm />
      </Modal>
      <Modal open={openConsulaireModal} onClose={() => setOpenConsulaireModal(false)} maxWidth="max-w-5xl">
        <ConsulaireCardForm />
      </Modal>
      <Modal open={openLaissezPasserModal} onClose={() => setOpenLaissezPasserModal(false)} maxWidth="max-w-5xl">
        <LaissezPasserForm />
      </Modal>
      <Modal open={openPassportModal} onClose={() => setOpenPassportModal(false)} maxWidth="max-w-5xl">
        <PassportForm />
      </Modal>
      <Modal open={openProcurationModal} onClose={() => setOpenProcurationModal(false)} maxWidth="max-w-5xl">
        <ProcurationForm />
      </Modal>
      <Modal open={openCertificatModal} onClose={() => setOpenCertificatModal(false)} maxWidth="max-w-5xl">
        <CertificatNationaliteForm />
      </Modal>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Colonne gauche : accordéon services */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-[#181F2B] dark:text-white mb-1">Choisir un service</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-3">Une liste claire des services consulaires offerts par l&apos;Ambassade du Tchad.</p>
          <Accordion title="Demande de visa" defaultOpen>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              Les demandes de visa sur passeport ordinaire déposées en Côte d&apos;Ivoire sont instruites par l&apos;ambassade du TCHAD à Abidjan, seul habilité à prendre les décisions en matière de visas.<br /><br />
              Notre service vous assiste dans la préparation de votre dossier de demande, la vérification de la conformité des documents, la prise de rendez-vous avec l&apos;ambassade, et même dans le suivi de la demande.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE DEMANDE DE VISA</div>
                <div className="font-bold text-lg dark:text-white">50 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenVisaModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <Accordion title="Demande de carte consulaire">
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              La carte consulaire est un document officiel délivré par l&apos;Ambassade du Tchad permettant d&apos;attester de votre inscription auprès de la représentation diplomatique. Elle facilite vos démarches administratives et l&apos;accès à certains services réservés aux ressortissants tchadiens à l&apos;étranger.<br /><br />
              Notre équipe vous accompagne dans la constitution du dossier, la vérification des pièces justificatives et le suivi de votre demande.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE CARTE CONSULAIRE</div>
                <div className="font-bold text-lg dark:text-white">20 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenConsulaireModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <Accordion title="Demande de Passeport">
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              Le passeport est un document de voyage sécurisé délivré par l&apos;Ambassade du Tchad. Il permet à tout citoyen tchadien de voyager à l&apos;étranger et de prouver son identité.<br /><br />
              Nous vous guidons dans la préparation de votre dossier, la prise de rendez-vous et le suivi de l&apos;avancement de votre demande.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE PASSEPORT</div>
                <div className="font-bold text-lg dark:text-white">60 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenPassportModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <Accordion title="Demande de Laissez-passer">
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              Le laissez-passer est un document exceptionnel délivré pour permettre à un citoyen tchadien dépourvu de passeport de rentrer au Tchad ou de régulariser sa situation.<br /><br />
              Notre service vous informe sur les conditions d&apos;éligibilité, les pièces à fournir et vous accompagne dans la procédure.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE LAISSEZ-PASSER</div>
                <div className="font-bold text-lg dark:text-white">15 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenLaissezPasserModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <Accordion title="Demande de Procuration">
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              La procuration permet à un citoyen tchadien de mandater une personne pour effectuer des démarches administratives en son nom auprès des autorités tchadiennes.<br /><br />
              Nous vous assistons dans la rédaction de la procuration, la constitution du dossier et le suivi de la demande.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE PROCURATION</div>
                <div className="font-bold text-lg dark:text-white">10 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenProcurationModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <Accordion title="Demande de certificat de nationalité">
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              Le certificat de nationalité est un document officiel attestant de la nationalité tchadienne d&apos;une personne. Il est souvent exigé pour diverses démarches administratives ou juridiques.<br /><br />
              Notre équipe vous accompagne dans la constitution du dossier, la vérification des pièces justificatives et le suivi de votre demande.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-[#F9FAFB] dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">FRAIS DE CERTIFICAT DE NATIONALITÉ</div>
                <div className="font-bold text-lg dark:text-white">20 000 FCFA</div>
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setOpenCertificatModal(true)} className="bg-[#F44C27] hover:bg-[#e13a1a] text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto">Commencer la demande</button>
              </div>
            </div>
          </Accordion>
          <div className="flex justify-end mt-2">
            <a href="#" className="text-[#F44C27] text-sm font-semibold hover:underline">Voir Toutes Les Services</a>
          </div>
        </div>
        {/* Colonne droite : actualités + services rapides */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          <NewsCarouselPro />
          <QuickActions />
        </div>
      </div>
    </div>
  );
} 