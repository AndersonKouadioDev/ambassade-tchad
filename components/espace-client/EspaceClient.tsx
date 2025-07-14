import React, { useState } from 'react';
import Image from 'next/image';
import { getAllEvents } from '../../lib/events-store';
import { getAllNews } from '../../lib/news-store';
import { getAllPhotos } from '../../lib/gallery-store';
import { getAllVideos } from '../../lib/video-store';
import { User, News, Event, Photo, Video } from '../../lib/types';
import {
  ServiceType,
  Gender,
  MaritalStatus,
  PassportType,
  VisaType,
  JustificationDocumentType,
  OriginCountryParentRelationshipType
} from '../../lib/demande-types';

// Mock user (à remplacer par l'utilisateur authentifié réel)
const mockUser = {
  id: 'user-1',
  email: 'fatime.mah@example.com',
  password: '',
  firstName: 'Fatimé',
  lastName: 'Mahamat',
  phoneNumber: '+225 01 23 45 67 89',
  role: undefined,
  type: 'DEMANDEUR',
  status: 'ACTIVE',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01')
};



interface EspaceClientProps {
  user: User;
  news: News[];
  events: Event[];
  photos: Photo[];
  videos: Video[];
}

// Mapping strict des champs pour chaque type de service/document
const DOCUMENTS = [
  {
    key: ServiceType.VISA,
    label: "Visa",
    fields: [
      { name: "personFirstName", label: "Prénom", type: "text", required: true },
      { name: "personLastName", label: "Nom", type: "text", required: true },
      { name: "personGender", label: "Genre", type: "select", required: true, options: Object.values(Gender) },
      { name: "personNationality", label: "Nationalité", type: "text", required: true },
      { name: "personBirthDate", label: "Date de naissance", type: "date", required: true },
      { name: "personBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "personMaritalStatus", label: "État civil", type: "select", required: true, options: Object.values(MaritalStatus) },
      { name: "passportType", label: "Type de passeport", type: "select", required: true, options: Object.values(PassportType) },
      { name: "passportNumber", label: "Numéro de passeport", type: "text", required: true },
      { name: "passportIssuedBy", label: "Délivré par", type: "text", required: true },
      { name: "passportIssueDate", label: "Date de délivrance du passeport", type: "date", required: true },
      { name: "passportExpirationDate", label: "Expiration du passeport", type: "date", required: true },
      { name: "profession", label: "Profession", type: "text", required: false },
      { name: "employerAddress", label: "Adresse de l'employeur", type: "text", required: false },
      { name: "employerPhoneNumber", label: "Téléphone de l'employeur", type: "text", required: false },
      { name: "visaType", label: "Type de visa", type: "select", required: true, options: Object.values(VisaType) },
      { name: "durationMonths", label: "Durée (mois)", type: "number", required: true },
      { name: "destinationState", label: "Destination", type: "text", required: false },
      { name: "visaExpirationDate", label: "Expiration du visa", type: "date", required: false },
    ],
  },
  {
    key: ServiceType.BIRTH_ACT_APPLICATION,
    label: "Acte de naissance",
    fields: [
      { name: "personFirstName", label: "Prénom", type: "text", required: true },
      { name: "personLastName", label: "Nom", type: "text", required: true },
      { name: "personBirthDate", label: "Date de naissance", type: "date", required: true },
      { name: "personBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "personNationality", label: "Nationalité", type: "text", required: true },
      { name: "personDomicile", label: "Domicile", type: "text", required: false },
      { name: "fatherFullName", label: "Nom complet du père", type: "text", required: true },
      { name: "motherFullName", label: "Nom complet de la mère", type: "text", required: true },
      { name: "requestType", label: "Type de demande", type: "select", required: true, options: ["NEWBORN", "RENEWAL"] },
    ],
  },
  {
    key: ServiceType.CONSULAR_CARD,
    label: "Carte consulaire",
    fields: [
      { name: "personFirstName", label: "Prénom", type: "text", required: true },
      { name: "personLastName", label: "Nom", type: "text", required: true },
      { name: "personBirthDate", label: "Date de naissance", type: "date", required: true },
      { name: "personBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "personProfession", label: "Profession", type: "text", required: false },
      { name: "personNationality", label: "Nationalité", type: "text", required: true },
      { name: "personDomicile", label: "Domicile", type: "text", required: false },
      { name: "personAddressInOriginCountry", label: "Adresse au pays d'origine", type: "text", required: false },
      { name: "fatherFullName", label: "Nom du père", type: "text", required: false },
      { name: "motherFullName", label: "Nom de la mère", type: "text", required: false },
      { name: "justificationDocumentType", label: "Type de justificatif", type: "select", required: false, options: Object.values(JustificationDocumentType) },
      { name: "justificationDocumentNumber", label: "Numéro du justificatif", type: "text", required: false },
      { name: "cardExpirationDate", label: "Expiration de la carte", type: "date", required: false },
    ],
  },
  {
    key: ServiceType.LAISSEZ_PASSER,
    label: "Laissez-passer",
    fields: [
      { name: "personFirstName", label: "Prénom", type: "text", required: true },
      { name: "personLastName", label: "Nom", type: "text", required: true },
      { name: "personBirthDate", label: "Date de naissance", type: "date", required: true },
      { name: "personBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "personProfession", label: "Profession", type: "text", required: false },
      { name: "personNationality", label: "Nationalité", type: "text", required: true },
      { name: "personDomicile", label: "Domicile", type: "text", required: false },
      { name: "fatherFullName", label: "Nom du père", type: "text", required: false },
      { name: "motherFullName", label: "Nom de la mère", type: "text", required: false },
      { name: "destination", label: "Destination", type: "text", required: false },
      { name: "travelReason", label: "Motif du voyage", type: "text", required: false },
      { name: "accompanied", label: "Accompagné ?", type: "checkbox", required: true },
      { name: "justificationDocumentType", label: "Type de justificatif", type: "select", required: false, options: Object.values(JustificationDocumentType) },
      { name: "justificationDocumentNumber", label: "Numéro du justificatif", type: "text", required: false },
      { name: "laissezPasserExpirationDate", label: "Expiration du laissez-passer", type: "date", required: true },
    ],
  },
  {
    key: ServiceType.POWER_OF_ATTORNEY,
    label: "Procuration",
    fields: [
      { name: "agentFirstName", label: "Prénom du mandataire", type: "text", required: true },
      { name: "agentLastName", label: "Nom du mandataire", type: "text", required: true },
      { name: "agentJustificationDocumentType", label: "Type de justificatif du mandataire", type: "select", required: false, options: Object.values(JustificationDocumentType) },
      { name: "agentIdDocumentNumber", label: "Numéro justificatif du mandataire", type: "text", required: false },
      { name: "agentAddress", label: "Adresse du mandataire", type: "text", required: false },
      { name: "principalFirstName", label: "Prénom du donneur d'ordre", type: "text", required: true },
      { name: "principalLastName", label: "Nom du donneur d'ordre", type: "text", required: true },
      { name: "principalJustificationDocumentType", label: "Type de justificatif du donneur d'ordre", type: "select", required: false, options: Object.values(JustificationDocumentType) },
      { name: "principalIdDocumentNumber", label: "Numéro justificatif du donneur d'ordre", type: "text", required: false },
      { name: "principalAddress", label: "Adresse du donneur d'ordre", type: "text", required: false },
      { name: "powerOfType", label: "Type de procuration", type: "text", required: false },
      { name: "reason", label: "Motif", type: "text", required: false },
    ],
  },
  {
    key: ServiceType.NATIONALITY_CERTIFICATE,
    label: "Certificat de nationalité",
    fields: [
      { name: "applicantFirstName", label: "Prénom du demandeur", type: "text", required: true },
      { name: "applicantLastName", label: "Nom du demandeur", type: "text", required: true },
      { name: "applicantBirthDate", label: "Date de naissance", type: "date", required: true },
      { name: "applicantBirthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "applicantNationality", label: "Nationalité", type: "text", required: true },
      { name: "originCountryParentFirstName", label: "Prénom du parent d'origine", type: "text", required: true },
      { name: "originCountryParentLastName", label: "Nom du parent d'origine", type: "text", required: true },
      { name: "originCountryParentRelationship", label: "Lien de parenté", type: "select", required: true, options: Object.values(OriginCountryParentRelationshipType) },
    ],
  },
  {
    key: ServiceType.MARRIAGE_CAPACITY_ACT,
    label: "Acte de capacité de mariage",
    fields: [
      { name: "husbandFirstName", label: "Prénom de l'époux", type: "text", required: true },
      { name: "husbandLastName", label: "Nom de l'époux", type: "text", required: true },
      { name: "husbandBirthDate", label: "Date de naissance de l'époux", type: "date", required: true },
      { name: "husbandBirthPlace", label: "Lieu de naissance de l'époux", type: "text", required: true },
      { name: "husbandNationality", label: "Nationalité de l'époux", type: "text", required: true },
      { name: "husbandDomicile", label: "Domicile de l'époux", type: "text", required: false },
      { name: "wifeFirstName", label: "Prénom de l'épouse", type: "text", required: true },
      { name: "wifeLastName", label: "Nom de l'épouse", type: "text", required: true },
      { name: "wifeBirthDate", label: "Date de naissance de l'épouse", type: "date", required: true },
      { name: "wifeBirthPlace", label: "Lieu de naissance de l'épouse", type: "text", required: true },
      { name: "wifeNationality", label: "Nationalité de l'épouse", type: "text", required: true },
      { name: "wifeDomicile", label: "Domicile de l'épouse", type: "text", required: false },
    ],
  },
  {
    key: ServiceType.DEATH_ACT_APPLICATION,
    label: "Acte de décès",
    fields: [
      { name: "deceasedFirstName", label: "Prénom du défunt", type: "text", required: true },
      { name: "deceasedLastName", label: "Nom du défunt", type: "text", required: true },
      { name: "deceasedBirthDate", label: "Date de naissance du défunt", type: "date", required: true },
      { name: "deceasedDeathDate", label: "Date du décès", type: "date", required: true },
      { name: "deceasedNationality", label: "Nationalité du défunt", type: "text", required: true },
    ],
  },
];

const EspaceClient: React.FC<EspaceClientProps> = ({ user, news, events, photos, videos }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCUMENTS[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Pour l'avatar, on affiche les initiales si pas d'image
  const userInitials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header utilisateur */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-blue-200 bg-secondary flex items-center justify-center text-white text-4xl font-bold shadow">
            {userInitials}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-1">Bienvenue, {user.firstName} {user.lastName} !</h1>
            <p className="text-gray-600 text-sm">Membre depuis le {user.createdAt.toLocaleDateString('fr-FR')}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>

        {/* Bouton Faire une demande */}
        <div className="flex justify-end mb-8">
          <button
            className="bg-secondary text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-secondary/90 transition text-lg"
            onClick={() => { setModalOpen(true); setStep(0); setSelectedDoc(null); setFormData({}); }}
          >
            Faire une demande
          </button>
        </div>

        {/* Modal multi-step amélioré */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-10 relative animate-fade-in">
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
              >✕</button>
              {/* Étape 1 : Choix du document */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Quel document souhaitez-vous demander ?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DOCUMENTS.map(doc => (
                      <button
                        key={doc.key}
                        className={`w-full py-4 rounded-xl border font-semibold text-lg transition ${selectedDoc?.key === doc.key ? 'bg-secondary text-white' : 'bg-gray-100 hover:bg-secondary/10'}`}
                        onClick={() => { setSelectedDoc(doc); setStep(1); }}
                      >
                        {doc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Étape 2 : Formulaire dynamique selon le document */}
              {step === 1 && selectedDoc && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Informations pour {selectedDoc.label}</h2>
                  <form
                    className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                    onSubmit={e => { e.preventDefault(); setStep(2); }}
                  >
                    {selectedDoc.fields.map(field => (
                      <div key={field.name} className="flex flex-col gap-1">
                        <label className="block font-semibold" htmlFor={field.name}>{field.label}{field.required && ' *'}</label>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            value={formData[field.name] || ''}
                            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                          >
                            <option value="">Sélectionner...</option>
                            {field.options && field.options.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'checkbox' ? (
                          <input
                            id={field.name}
                            name={field.name}
                            type="checkbox"
                            checked={!!formData[field.name]}
                            onChange={e => setFormData({ ...formData, [field.name]: e.target.checked })}
                            className="w-5 h-5"
                            required={field.required}
                          />
                        ) : field.type === 'file' ? (
                          <input
                            id={field.name}
                            name={field.name}
                            type="file"
                            required={field.required}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                            onChange={e => setFormData({ ...formData, [field.name]: e.target.files?.[0] })}
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            className="w-full px-4 py-2 border rounded-lg"
                            value={formData[field.name] || ''}
                            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between gap-2 pt-4">
                      <button type="button" className="px-4 py-2 rounded bg-gray-100" onClick={() => setStep(0)}>Retour</button>
                      <button type="submit" className="px-6 py-2 rounded bg-secondary text-white font-semibold">Suivant</button>
                    </div>
                  </form>
                </div>
              )}
              {/* Étape 3 : Récapitulatif */}
              {step === 2 && selectedDoc && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Récapitulatif</h2>
                  <div className="mb-6 space-y-2">
                    <div><span className="font-semibold">Document :</span> {selectedDoc.label}</div>
                    {selectedDoc.fields.map(field => (
                      <div key={field.name}>
                        <span className="font-semibold">{field.label} :</span> {field.type === 'file' ? ((formData[field.name]?.name) || 'Non fourni') : (formData[field.name] || 'Non renseigné')}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2">
                    <button className="px-4 py-2 rounded bg-gray-100" onClick={() => setStep(1)}>Retour</button>
                    <button className="px-6 py-2 rounded bg-secondary text-white font-semibold" onClick={() => setStep(3)}>Procéder au paiement</button>
                  </div>
                </div>
              )}
              {/* Étape 4 : Paiement (mock) */}
              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-secondary mb-6">Paiement</h2>
                  <div className="mb-6">Paiement sécurisé (mock)</div>
                  <button className="px-6 py-2 rounded bg-secondary text-white font-semibold" onClick={() => setStep(4)}>Valider la demande</button>
                  <div className="mt-4">
                    <button className="text-sm text-gray-500 underline" onClick={() => setStep(2)}>Retour au récapitulatif</button>
                  </div>
                </div>
              )}
              {/* Étape 5 : Validation */}
              {step === 4 && selectedDoc && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-700 mb-6">Demande envoyée !</h2>
                  <div className="mb-6 text-gray-700">Votre demande de <span className="font-semibold">{selectedDoc.label}</span> a bien été enregistrée.<br/>Vous recevrez un email de confirmation.</div>
                  <button className="px-6 py-2 rounded bg-secondary text-white font-semibold" onClick={() => setModalOpen(false)}>Fermer</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Actualités */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Actualités récentes</h2>
            <ul className="space-y-3">
              {news.slice(0, 3).map((item) => (
                <li key={item.id} className="border-b last:border-b-0 pb-2">
                  <span className="font-medium text-blue-700">{item.title}</span>
                  <span className="block text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Événements */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Événements à venir</h2>
            <ul className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <li key={event.id} className="border-b last:border-b-0 pb-2">
                  <span className="font-medium text-blue-700">{event.title}</span>
                  <span className="block text-xs text-gray-400">{event.eventDate.toLocaleDateString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Galerie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Photos */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Galerie photos</h2>
            <div className="flex gap-2 overflow-x-auto">
              {photos.slice(0, 4).map((photo) => (
                <Image
                  key={photo.id}
                  src={photo.imageUrl}
                  alt={photo.title || 'Photo'}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg border border-blue-100 shadow"
                />
              ))}
            </div>
          </div>
          {/* Vidéos */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Galerie vidéos</h2>
            <div className="flex gap-2 overflow-x-auto">
              {videos.slice(0, 2).map((video) => (
                <video
                  key={video.id}
                  src={video.youtubeUrl}
                  controls
                  className="w-40 h-24 rounded-lg border border-blue-100 shadow bg-black"
                  aria-label={video.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Récupération des données mock (à remplacer par un fetch côté serveur ou client réel)
export default function EspaceClientContainer() {
  const user = mockUser;
  const news = getAllNews();
  const events = getAllEvents();
  const photos = getAllPhotos();
  const videos = getAllVideos();

  return <EspaceClient user={user} news={news} events={events} photos={photos} videos={videos} />;
}
