"use client";
import { useKKiaPay } from "kkiapay-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useGetDataPaiement from "./components/useGetDataPaiement";
import { usePaiementCreateMutation } from "@/features/paiement/queries/paiement.mutation";
import { Button, Spinner } from "@heroui/react";
import { Link, redirect } from "@/i18n/navigation";
import { useGetDemandeByTicketQuery } from "@/features/demande/queries/demande-detail.query";
import { useTranslations } from "next-intl";

export interface ResponseKkiaPay {
  transactionId: string;
  reason?: {
    code: string;
    description: string;
  };
}

export default function Content({
  apiKey,
  sandbox,
}: {
  apiKey: string;
  sandbox: boolean;
}) {
  const t = useTranslations("espaceClient.mesDemandesClient");

  const translateStatus = (statuts: string) => {
    const translations: Record<string, string> = {
      NEW: t("statuts.NEW"),
      IN_REVIEW_DOCS: t("statuts.IN_REVIEW_DOCS"),
      PENDING_ADDITIONAL_INFO: t("statuts.PENDING_ADDITIONAL_INFO"),
      APPROVED_BY_AGENT: t("statuts.APPROVED_BY_AGENT"),
      APPROVED_BY_CHEF: t("statuts.APPROVED_BY_CHEF"),
      APPROVED_BY_CONSUL: t("statuts.APPROVED_BY_CONSUL"),
      READY_FOR_PICKUP: t("statuts.READY_FOR_PICKUP"),
      DELIVERED: t("statuts.DELIVERED"),
      ARCHIVED: t("statuts.ARCHIVED"),
      EXPIRED: t("statuts.EXPIRED"),
      RENEWAL_REQUESTED: t("statuts.RENEWAL_REQUESTED"),
      REJECTED: t("statuts.REJECTED"),
    };
    return translations[statuts] || statuts;
  };

  const translateServiceType = (serviceType: string) => {
    const translations: Record<string, string> = {
      CONSULAR_CARD: t("services.carteConsulaire"),
      POWER_OF_ATTORNEY: t("services.procuration"),
      MARRIAGE_CAPACITY_ACT: t("services.acteCapaciteMariage"),
      LAISSEZ_PASSER: t("services.laissezPasser"),
      DEATH_ACT_APPLICATION: t("services.acteDeces"),
      NATIONALITY_CERTIFICATE: t("services.certificatNationalite"),
      BIRTH_ACT_APPLICATION: t("services.acteNaissance"),
      VISA: t("services.visa"),
    };
    return translations[serviceType] || serviceType;
  };

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } =
    useKKiaPay();

  // Mutation pour créer le paiement
  const { mutateAsync: createPaiement, isPending: isCreatingPaiement } =
    usePaiementCreateMutation();

  const router = useRouter();

  // Récupérer les données dans l'url
  const { amount, ticketNumber, isValid } = useGetDataPaiement();

  const {
    data: demande,
    isLoading: isLoadingDemande,
    isError,
  } = useGetDemandeByTicketQuery(ticketNumber);

  // Fonction pour ouvrir le widget de paiement
  const openPaymentWidget = useCallback(() => {
    if (!isValid || !amount || !ticketNumber) {
      console.error("Données de paiement invalides");
      return;
    }

    openKkiapayWidget({
      theme: "blue",
      amount,
      api_key: apiKey,
      sandbox,
    });
  }, [openKkiapayWidget, amount, apiKey, sandbox, isValid, ticketNumber]);

  // Gestionnaire de succès du paiement
  const handlePaymentSuccess = useCallback(
    async (response: ResponseKkiaPay) => {
      if (isPaymentProcessing) return; // Éviter les doublons

      setIsPaymentProcessing(true);
      await createPaiement({
        data: {
          transactionRef: response.transactionId,
          ticketNumber,
        },
      });

      // Redirection après succès
      router.push("/espace-client/mes-demandes");
      setIsPaymentProcessing(false);
    },
    [createPaiement, ticketNumber, router, isPaymentProcessing]
  );

  // Gestionnaire d'échec du paiement
  const handlePaymentFailed = useCallback((response: ResponseKkiaPay) => {
    console.error("Paiement échoué:", response.reason);
    setIsPaymentProcessing(false);
  }, []);

  // Configuration des listeners de paiement
  useEffect(() => {
    if (!ticketNumber || !isValid) return;

    addKkiapayListener("success", handlePaymentSuccess);
    addKkiapayListener("failed", handlePaymentFailed);

    return () => {
      removeKkiapayListener("success");
      removeKkiapayListener("failed");
    };
  }, [
    addKkiapayListener,
    removeKkiapayListener,
    handlePaymentSuccess,
    handlePaymentFailed,
    ticketNumber,
    isValid,
  ]);

  // Gestion de la redirection si la demande n'existe pas
  useEffect(() => {
    if (!isLoadingDemande && isError && !demande) {
      setShouldRedirect(true);
    }
  }, [isLoadingDemande, isError, demande]);

  // Redirection si nécessaire
  if (shouldRedirect) {
    redirect({ href: "/espace-client/mes-demandes", locale: "fr" });
    return null;
  }

  // États de chargement
  if (isLoadingDemande) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  // Si les données ne sont pas valides
  if (!isValid || !ticketNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">
            Les informations de paiement sont invalides ou manquantes.
          </p>
          <Button as={Link} href="/espace-client/mes-demandes" color="primary">
            Retour à mes demandes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-primary mb-4">Paiement</h2>

        {demande && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Service: {translateServiceType(demande.serviceType)}
            </p>
            <p className="text-sm text-gray-600">
              Statut: {translateStatus(demande.status)}
            </p>
            <p className="text-sm text-gray-600">Ticket: {ticketNumber}</p>
            <p className="text-lg font-semibold text-gray-800">
              Montant: {amount} FCFA
            </p>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Cliquez sur le bouton ci-dessous pour procéder au paiement
        </p>

        <div className="flex flex-col gap-4">
          <Button
            color="primary"
            size="lg"
            onPress={openPaymentWidget}
            isDisabled={isPaymentProcessing || isCreatingPaiement}
            isLoading={isPaymentProcessing || isCreatingPaiement}
            className="w-full"
          >
            {isPaymentProcessing || isCreatingPaiement
              ? "Traitement en cours..."
              : `Payer ${amount} FCFA`}
          </Button>

          <Button
            variant="bordered"
            as={Link}
            href="/espace-client/mes-demandes"
            color="primary"
            size="lg"
            isDisabled={isPaymentProcessing || isCreatingPaiement}
            className="w-full"
          >
            Annuler
          </Button>
        </div>

        {isPaymentProcessing && (
          <p className="mt-4 text-sm text-blue-600">
            Traitement du paiement en cours, veuillez patienter...
          </p>
        )}
      </div>
    </div>
  );
}
