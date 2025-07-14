'use client';

import React, { useState } from 'react';
import { ServiceType } from '../../lib/demande-types-client'; 
import PassportForm from './PassportForm';
import LaissezPasserForm from './LaissezPasserForm';
import ConsulaireCardForm from './ConsulaireCardForm';
import CertificatNationaliteForm from './CertificatNationaliteForm';
import ProcurationForm from '../procuration/procuration';
import VisaForm from './VisaForm';

const DOCUMENTS = [
  { key: ServiceType.PASSPORT, label: 'Passeport', form: <PassportForm /> },
  { key: ServiceType.LAISSEZ_PASSER, label: 'Laissez-passer', form: <LaissezPasserForm /> },
  { key: ServiceType.POWER_OF_ATTORNEY, label: 'Procuration', form: <ProcurationForm /> }, 
  { key: ServiceType.CONSULAR_DOC, label: 'Carte consulaire', form: <ConsulaireCardForm /> },
  { key: 'CERTIFICAT_NATIONALITE', label: 'Certificat de nationalité', form: <CertificatNationaliteForm /> },
  { key: 'VISA', label: 'Visa', form: <VisaForm /> },
];

export default function QuickActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCUMENTS[0] | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);

  function handleCardClick(doc: typeof DOCUMENTS[0]) {
    setModalOpen(false);
    setTimeout(() => {
      setSelectedDoc(doc);
      setFormModalOpen(true);
    }, 300);
  }

  function handleCloseFormModal() {
    setFormModalOpen(false);
    setSelectedDoc(null);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 md:mb-6">
      {/* Dégradé de fond décoratif */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#e0e7ff] via-[#f6f8fa] to-[#f3f4f6] dark:from-[#232b4d] dark:via-gray-900 dark:to-gray-800" />
      <div className="relative z-10 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow p-4 md:p-8 lg:p-10 border border-[#EDF1F7] dark:border-gray-700 backdrop-blur">
        <div className="text-2xl md:text-4xl font-extrabold text-[#181F2B] dark:text-white mb-2 text-center tracking-tight drop-shadow-sm">Services Rapides</div>
        <div className="text-base md:text-lg text-gray-500 dark:text-gray-300 mb-6 text-center">Accédez rapidement à tous vos formulaires de demande consulaire</div>
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-md px-2 py-4 md:py-6 flex justify-center items-center transition border border-[#F3F5F8] dark:border-gray-800">
          <button
            className="bg-gradient-to-r from-[#F44C27] to-[#ff7e5f] hover:from-[#e13a1a] hover:to-[#ff7e5f] focus:bg-[#d12d0f] text-white font-semibold text-lg md:text-2xl px-8 md:px-16 py-3 md:py-4 rounded-2xl shadow-lg transition-all duration-200 focus:outline-none w-full max-w-full md:max-w-2xl tracking-wide"
            onClick={() => setModalOpen(true)}
          >
            Faire une nouvelle demande
          </button>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="relative w-full max-w-2xl p-0 animate-fade-in flex flex-col items-center">
            {/* Dégradé décoratif dans le modal */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#e0e7ff] via-[#f6f8fa] to-[#f3f4f6] dark:from-[#232b4d] dark:via-gray-900 dark:to-gray-800 z-0" />
            <div className="relative z-10 bg-white/90 dark:bg-gray-900/95 rounded-3xl shadow-2xl w-full p-8 flex flex-col items-center animate-scale-in">
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
              >✕</button>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F44C27] mb-8 text-center drop-shadow">Choisissez le document à demander</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {DOCUMENTS.map(doc => (
                  <button
                    key={doc.key}
                    className="group flex flex-col items-center justify-center p-8 rounded-2xl border border-[#EDF1F7] dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 font-semibold text-lg shadow-md hover:shadow-2xl hover:bg-[#F6F8FA] dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F44C27] scale-100 hover:scale-105 hover:-rotate-1 relative"
                    onClick={() => handleCardClick(doc)}
                  >
                    <span className="relative flex items-center justify-center mb-2">
                      <span className="absolute -inset-3 rounded-full bg-[#F44C27]/10 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 blur-sm" />
                     
                    </span>
                    <span className="text-base md:text-lg font-bold text-[#F44C27] group-hover:text-[#F44C27] transition-colors duration-200 drop-shadow-sm">{doc.label}</span>
                    {/* Description sous la card */}
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-300 text-center font-normal">
                      {doc.label === 'Passeport' && 'Demandez un passeport biométrique tchadien'}
                      {doc.label === 'Laissez-passer' && 'Obtenez un laissez-passer pour rentrer au Tchad'}
                      {doc.label === 'Procuration' && 'Mandatez une personne pour vos démarches'}
                      {doc.label === 'Carte consulaire' && 'Inscrivez-vous auprès de l’ambassade'}
                      {doc.label === 'Certificat de nationalité' && 'Justifiez votre nationalité tchadienne'}
                      {doc.label === 'Visa' && 'Demandez un visa pour voyager'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {formModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative animate-fade-in flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl"
              onClick={handleCloseFormModal}
              aria-label="Fermer"
            >✕</button>
            <div className="w-full flex flex-col items-center justify-center">
              {selectedDoc.form}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 