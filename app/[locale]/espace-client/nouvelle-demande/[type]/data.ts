import BirthActForm from "@/features/demande/components/demande-acte-naissance-form";
import CarteConsulaireForm from "@/features/demande/components/demande-carte-consulaire/";
import CertificatNationaliteForm from "@/features/demande/components/certificat-nationnalite/certificat-nationnalite-form";
import MarriageCapacityActForm from "@/features/demande/components/mariage/mariage-form";
import ProcurationForm from "@/features/demande/components/procuration/procuration-form";
import VisaForm from "@/features/demande/components/visa/visa-form";
import CertificatDecesForm from "@/features/demande/components/demande-certificat-deces-form";
import LaisserPasserForm from "@/features/demande/components/demande-laisser-passer-form";

export const tousTypeDemandes = {
    "visa": {
        key: "visa",
        component: VisaForm,
        documents: [],
        processingTimeKey: "processingTime.5-15",
    },
    "birth-act": {
        key: "birthAct",
        component: BirthActForm,
        documents: [],
        processingTimeKey: "processingTime.3-7",
    },
    "consular-card": {
        key: "consularCard",
        component: CarteConsulaireForm,
        documents: [],
        processingTimeKey: "processingTime.10-20",
    },
    "laissez-passer": {
        key: "laissezPasser",
        component: LaisserPasserForm,
        documents: [],
        processingTimeKey: "processingTime.2-5",
    },
    "marriage-capacity": {
        key: "marriageCapacity",
        component: MarriageCapacityActForm,
        documents: [],
        processingTimeKey: "processingTime.5-10",
    },
    "death-act": {
        key: "deathAct",
        component: CertificatDecesForm,
        documents: [],
        processingTimeKey: "processingTime.3-7",
    },
    "power-of-attorney": {
        key: "powerOfAttorney",
        component: ProcurationForm,
        documents: [],
        processingTimeKey: "processingTime.3-5",
    },
    "nationality-certificate": {
        key: "nationalityCertificate",
        component: CertificatNationaliteForm,
        documents: [],
        processingTimeKey: "processingTime.7-15",
    },
};

export type DemandType = keyof typeof tousTypeDemandes;