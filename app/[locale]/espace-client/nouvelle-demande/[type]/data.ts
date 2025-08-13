import BirthActForm from "@/features/demande/components/demande-acte-naissance-form";
import CarteConsulaireForm from "@/features/demande/components/demande-carte-consulaire/";
import CertificatNationaliteForm from "@/features/demande/components/certificat-nationnalite/certificat-nationnalite-form";
import MarriageCapacityActForm from "@/features/demande/components/mariage/mariage-form";
import ProcurationForm from "@/features/demande/components/procuration/procuration-form";
import VisaForm from "@/features/demande/components/visa/visa-form";

export const tousTypeDemandes = {
    visa: {
        title: "Demande de Visa",
        description:
            "Remplissez ce formulaire pour soumettre votre demande de visa. Assurez-vous d'avoir tous les documents nécessaires avant de commencer.",
        component: VisaForm,
        documents: [
            "Passeport valide (minimum 6 mois de validité)",
            "Photo d'identité récente",
            "Justificatif de ressources financières",
        ],
        processingTime: "5-15 jours ouvrables",
    },
    "birth-act": {
        title: "Demande d'Acte de Naissance",
        description: "Remplissez ce formulaire pour demander un acte de naissance.",
        component: BirthActForm,
        documents: [],
        processingTime: "3-7 jours",
    },
    "consular-card": {
        title: "Demande de Carte Consulaire",
        description: "Remplissez ce formulaire pour demander une carte consulaire.",
        component: CarteConsulaireForm,
        documents: [],
        processingTime: "10-20 jours",
    },
    // "laissez-passer": {
    //     title: "Demande de Laissez-passer",
    //     description: "Remplissez ce formulaire pour demander un laissez-passer.",
    //     component: LaissezPasserForm,
    //     documents: [],
    //     processingTime: "2-5 jours",
    // },
    "marriage-capacity": {
        title: "Certificat de Capacité Mariage",
        description:
            "Demande de certificat de capacité mariage - Formulaire en cours de développement.",
        component: MarriageCapacityActForm,
        documents: ["Photo d'identité récente"],
        processingTime: "5-10 jours",
    },
    // "death-act": {
    //     title: "Demande d'Acte de Décès",
    //     description:
    //         "Demande d'acte de décès - Formulaire en cours de développement.",
    //     component: DeathActForm,
    //     documents: [],
    //     processingTime: "3-7 jours",
    // },
    "power-of-attorney": {
        title: "Demande de Procuration",
        description: "Remplissez ce formulaire pour demander une procuration.",
        component: ProcurationForm,
        documents: [],
        processingTime: "3-5 jours",
    },
    "nationality-certificate": {
        title: "Certificat de Nationalité",
        description:
            "Demande de certificat de nationalité tchadienne - Formulaire en cours de développement.",
        component: CertificatNationaliteForm,
        documents: [
            "Passeport valide (minimum 6 mois de validité)",
            "Photo d'identité récente",
            "Justificatif de ressources financières",
        ],
        processingTime: "7-15 jours",
    },
};
