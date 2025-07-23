"use client";
import React from 'react';
import MultiStepDemandeForm from '../MultiStepDemandeForm';
import { consularCardRequestDetailsSchema } from '@/lib/validation/details-request.validation';
import type { z } from 'zod';
type ConsularCardFormInput = z.infer<typeof consularCardRequestDetailsSchema>;

const steps = [
  {
    title: 'Informations personnelles',
    fields: [
      { name: 'personFirstName', label: 'Prénom', type: 'text' as const, placeholder: 'Prénom' },
      { name: 'personLastName', label: 'Nom', type: 'text' as const, placeholder: 'Nom' },
      { name: 'personBirthDate', label: 'Date de naissance', type: 'date' as const, placeholder: 'Date de naissance' },
      { name: 'personBirthPlace', label: 'Lieu de naissance', type: 'text' as const, placeholder: 'Lieu de naissance' },
      { name: 'personProfession', label: 'Profession', type: 'text' as const, placeholder: 'Profession' },
      { name: 'personNationality', label: 'Nationalité', type: 'text' as const, placeholder: 'Nationalité' },
      { name: 'personDomicile', label: 'Domicile', type: 'text' as const, placeholder: 'Domicile' },
      { name: 'personAddressInOriginCountry', label: "Adresse au pays d'origine", type: 'text' as const, placeholder: "Adresse au pays d'origine" },
    ],
  },
  {
    title: 'Informations familiales',
    fields: [
      { name: 'fatherFullName', label: 'Nom du père', type: 'text' as const, placeholder: 'Nom du père' },
      { name: 'motherFullName', label: 'Nom de la mère', type: 'text' as const, placeholder: 'Nom de la mère' },
    ],
  },
  {
    title: 'Justificatif et contact',
    fields: [
      { name: 'justificationDocumentType', label: 'Type de pièce justificative', type: 'text' as const, placeholder: 'Type de pièce' },
      { name: 'justificationDocumentNumber', label: 'Numéro de pièce justificative', type: 'text' as const, placeholder: 'Numéro de pièce' },
      { name: 'contactPhoneNumber', label: 'Téléphone de contact', type: 'text' as const, placeholder: 'Téléphone' },
    ],
  },
];

export default function ConsulaireCardForm() {
  return (
    <MultiStepDemandeForm<ConsularCardFormInput>
      steps={steps}
      schema={consularCardRequestDetailsSchema}
      type="CONSULAR_CARD"
      detailsKey="consularCardDetails"
      contactField="contactPhoneNumber"
    />
  );
} 