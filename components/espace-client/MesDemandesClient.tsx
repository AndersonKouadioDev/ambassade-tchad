"use client";

import { useState } from "react";
import RequestsTablePro from "@/components/espace-client/RequestsTablePro";
import { useTranslations } from "next-intl";
import { useMyDemandesListQuery } from "@/features/demande/queries/demande-me-list.query";

const SERVICES = [
  "Carte Consulaire",
  "Visa",
  "Laissez-passer",
  "Procuration",
  "Acte de Capacité de Mariage",
  "Acte de Décès",
  "Certificat de Nationalité",
  "Acte de Naissance",
];

export default function MesDemandesClient() {
  const t = useTranslations("espaceClient.mesDemandesClient");

  // Traduction des services
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

  // Traduction des statuts
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      NEW: t("statuts.NEW"),
      IN_PROGRESS: t("statuts.IN_PROGRESS"),
      COMPLETED: t("statuts.COMPLETED"),
      READY_TO_PICKUP: t("statuts.READY_TO_PICKUP"),
      REJECTED: t("statuts.REJECTED"),
      IN_REVIEW_DOCS: t("statuts.IN_REVIEW_DOCS"),
      PENDING_ADDITIONAL_INFO: t("statuts.PENDING_ADDITIONAL_INFO"),
      APPROVED_BY_AGENT: t("statuts.APPROVED_BY_AGENT"),
      APPROVED_BY_CHEF: t("statuts.APPROVED_BY_CHEF"),
      APPROVED_BY_CONSUL: t("statuts.APPROVED_BY_CONSUL"),
      DELIVERED: t("statuts.DELIVERED"),
      ARCHIVED: t("statuts.ARCHIVED"),
      EXPIRED: t("statuts.EXPIRED"),
      RENEWAL_REQUESTED: t("statuts.RENEWAL_REQUESTED"),
    };
    return translations[status] || status;
  };

  // Liste des statuts pour le filtre
  const STATUS = [
    { value: "ALL", label: t("tous") },
    { value: "NEW", label: t("statuts.NEW") },
    { value: "IN_PROGRESS", label: t("statuts.IN_PROGRESS") },
    { value: "COMPLETED", label: t("statuts.COMPLETED") },
    { value: "READY_TO_PICKUP", label: t("statuts.READY_TO_PICKUP") },
    { value: "REJECTED", label: t("statuts.REJECTED") },
    { value: "IN_REVIEW_DOCS", label: t("statuts.IN_REVIEW_DOCS") },
    { value: "PENDING_ADDITIONAL_INFO", label: t("statuts.PENDING_ADDITIONAL_INFO") },
    { value: "APPROVED_BY_AGENT", label: t("statuts.APPROVED_BY_AGENT") },
    { value: "APPROVED_BY_CHEF", label: t("statuts.APPROVED_BY_CHEF") },
    { value: "APPROVED_BY_CONSUL", label: t("statuts.APPROVED_BY_CONSUL") },
    { value: "DELIVERED", label: t("statuts.DELIVERED") },
    { value: "ARCHIVED", label: t("statuts.ARCHIVED") },
    { value: "EXPIRED", label: t("statuts.EXPIRED") },
    { value: "RENEWAL_REQUESTED", label: t("statuts.RENEWAL_REQUESTED") },
  ];

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    ticket: "",
    service: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading: loading, error } = useMyDemandesListQuery({
    page,
    limit,
  });

  const demandes = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  const requests = demandes.map((d) => ({
    ticket: d.ticketNumber || "",
    service: translateServiceType(d.serviceType || ""),
    date: d.submissionDate
        ? new Date(d.submissionDate).toLocaleDateString("fr-FR")
        : "",
    status: d.status || "",
    translatedStatus: translateStatus(d.status || ""),
  }));

  // Fonction pour générer la pagination
  const renderPagination = () => {
    const pagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {total} {t("demandes")} • {t("page")} {page} {t("sur")} {totalPages}
          </div>

          <div className="flex items-center gap-1">
            {/* Bouton Précédent */}
            <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 rounded-md ${
                    page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={t("pagePrecedente")}
            >
              ‹
            </button>

            {/* Première page */}
            {startPage > 1 && (
                <>
                  <button
                      onClick={() => setPage(1)}
                      className={`w-10 h-10 rounded-md ${
                          1 === page
                              ? "bg-orange-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    1
                  </button>
                  {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {/* Pages intermédiaires */}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-md ${
                        p === page
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
            ))}

            {/* Dernière page */}
            {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && <span className="px-2">...</span>}
                  <button
                      onClick={() => setPage(totalPages)}
                      className={`w-10 h-10 rounded-md ${
                          totalPages === page
                              ? "bg-orange-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {totalPages}
                  </button>
                </>
            )}

            {/* Bouton Suivant */}
            <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-md ${
                    page === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={t("pageSuivante")}
            >
              ›
            </button>
          </div>
        </div>
    );
  };

  return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* En-tête */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
                <p className="text-gray-600">{t("description")}</p>
              </div>
              <button
                  className="inline-flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={() => setShowFilter((v) => !v)}
              >
                {t("filtrer")}
                <svg
                    className={`ml-2 h-4 w-4 transition-transform ${
                        showFilter ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Filtres */}
          {showFilter && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("noTicket")}
                    </label>
                    <input
                        type="text"
                        placeholder={t("placeholderTicket")}
                        value={filters.ticket}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, ticket: e.target.value }))
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("typeService")}
                    </label>
                    <select
                        value={filters.service}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, service: e.target.value }))
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="">{t("tous")}</option>
                      {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("statut")}
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, status: e.target.value }))
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    >
                      <option value="">{t("tous")}</option>
                      {STATUS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                      className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={() => setShowFilter(false)}
                  >
                    {t("appliquer")}
                  </button>
                </div>
              </div>
          )}

          {/* Contenu principal */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("listeDemandes")}
              </h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                  <div className="flex">
                    <div className="flex-shrink-0 text-red-500">⚠</div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error.message}</p>
                      <button
                          onClick={() => window.location.reload()}
                          className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        {t("reessayer")}
                      </button>
                    </div>
                  </div>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {t("aucuneDemandeTrouvee")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t("aucuneDemandeMessage")}
                  </p>
                </div>
            ) : (
                <>
                  {/* Demandes en attente */}
                  {(() => {
                    const pendingRequests = requests.filter(
                        (req) => req.status === translateStatus("PENDING")
                    );
                    return pendingRequests.length > 0 ? (
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {pendingRequests.length}
                        </span>
                              <span className="ml-2">{t("demandesEnAttente")}</span>
                            </h3>
                          </div>
                          <RequestsTablePro
                              filters={filters}
                              requests={pendingRequests}
                          />
                        </div>
                    ) : null;
                  })()}

                  {/* Toutes les demandes */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("toutesVosDemandes")} ({total})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <RequestsTablePro filters={filters} requests={requests} />
                  </div>

                  {/* Pagination */}
                  {renderPagination()}
                </>
            )}
          </div>
        </div>
      </div>
  );
}