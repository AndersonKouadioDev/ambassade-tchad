import { useTranslations } from "next-intl";
import {
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  Package,
  AlertCircle,
} from "lucide-react";
import React from "react";
import { DemandeStatus } from "@/features/demande/types/demande.type";

interface StatusStep {
  id: DemandeStatus;
  label: string;
  description: string;
  Icon: React.ReactNode;
  status: "completed" | "current" | "pending";
  date?: string;
}

interface StatusTimelineProps {
  currentStatus: DemandeStatus;
  submissionDate: string;
  updatedAt: string;
  completionDate?: string | null;
  issuedDate?: string | null;
  statusHistory?: Array<{
    newStatus: DemandeStatus;
    changedAt: Date | string;
  }>;
}

const STATUS_ICONS: Record<
  DemandeStatus,
  React.ComponentType<{ className?: string }>
> = {
  [DemandeStatus.NEW]: FileText,
  [DemandeStatus.IN_REVIEW_DOCS]: UserCheck,
  [DemandeStatus.PENDING_ADDITIONAL_INFO]: AlertCircle,
  [DemandeStatus.APPROVED_BY_AGENT]: UserCheck,
  [DemandeStatus.APPROVED_BY_CHEF]: UserCheck,
  [DemandeStatus.APPROVED_BY_CONSUL]: UserCheck,
  [DemandeStatus.READY_FOR_PICKUP]: Package,
  [DemandeStatus.DELIVERED]: CheckCircle,
  [DemandeStatus.REJECTED]: AlertCircle,
  [DemandeStatus.ARCHIVED]: FileText,
  [DemandeStatus.EXPIRED]: AlertCircle,
  [DemandeStatus.RENEWAL_REQUESTED]: Clock,
};

const STATUS_ORDER: DemandeStatus[] = [
  DemandeStatus.NEW,
  DemandeStatus.IN_REVIEW_DOCS,
  DemandeStatus.PENDING_ADDITIONAL_INFO,
  DemandeStatus.APPROVED_BY_AGENT,
  DemandeStatus.APPROVED_BY_CHEF,
  DemandeStatus.APPROVED_BY_CONSUL,
  DemandeStatus.READY_FOR_PICKUP,
  DemandeStatus.DELIVERED,
  DemandeStatus.REJECTED,
  DemandeStatus.ARCHIVED,
  DemandeStatus.EXPIRED,
  DemandeStatus.RENEWAL_REQUESTED,
];

const STATUS_COLORS: Record<
  DemandeStatus,
  {
    bg: string;
    text: string;
    border: string;
    icon: string;
    line: string;
  }
> = {
  [DemandeStatus.NEW]: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: "text-purple-500",
    line: "bg-purple-300",
  },
  [DemandeStatus.IN_REVIEW_DOCS]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: "text-blue-500",
    line: "bg-blue-300",
  },
  [DemandeStatus.PENDING_ADDITIONAL_INFO]: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: "text-amber-500",
    line: "bg-amber-300",
  },
  [DemandeStatus.APPROVED_BY_AGENT]: {
    bg: "bg-teal-100",
    text: "text-teal-800",
    border: "border-teal-200",
    icon: "text-teal-500",
    line: "bg-teal-300",
  },
  [DemandeStatus.APPROVED_BY_CHEF]: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-200",
    icon: "text-indigo-500",
    line: "bg-indigo-300",
  },
  [DemandeStatus.APPROVED_BY_CONSUL]: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: "text-green-500",
    line: "bg-green-300",
  },
  [DemandeStatus.READY_FOR_PICKUP]: {
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    border: "border-cyan-200",
    icon: "text-cyan-500",
    line: "bg-cyan-300",
  },
  [DemandeStatus.DELIVERED]: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    line: "bg-emerald-300",
  },
  [DemandeStatus.REJECTED]: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    icon: "text-red-500",
    line: "bg-red-300",
  },
  [DemandeStatus.ARCHIVED]: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    icon: "text-gray-500",
    line: "bg-gray-300",
  },
  [DemandeStatus.EXPIRED]: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    icon: "text-orange-500",
    line: "bg-orange-300",
  },
  [DemandeStatus.RENEWAL_REQUESTED]: {
    bg: "bg-sky-100",
    text: "text-sky-800",
    border: "border-sky-200",
    icon: "text-sky-500",
    line: "bg-sky-300",
  },
};

export default function StatusTimeline({
  currentStatus,
  updatedAt,
  statusHistory = [],
}: StatusTimelineProps) {
  const t = useTranslations("espaceClient.statusTimeline");

  const getStatusSteps = (): StatusStep[] => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);

    return STATUS_ORDER.map((status, index) => {
      const isCompleted = index < currentIndex;
      const isCurrent = index === currentIndex;
      const IconComponent = STATUS_ICONS[status];
      const statusEntry = statusHistory.find((h) => h.newStatus === status);

      const statusValue: "completed" | "current" | "pending" = isCurrent
        ? "current"
        : isCompleted
        ? "completed"
        : "pending";

      return {
        id: status,
        label: t(`etapes.${status.toLowerCase()}.titre`, {
          defaultValue: status,
        }),
        description: t(`etapes.${status.toLowerCase()}.description`, {
          defaultValue: "",
        }),
        Icon: <IconComponent className="w-5 h-5" />,
        status: statusValue,
        date:
          statusEntry?.changedAt?.toString() ||
          (isCurrent ? updatedAt : undefined),
      };
    }).filter((step) => step.label && step.description);
  };

  const steps = getStatusSteps();

  const getStatusStyles = (step: StatusStep) => {
    const baseColors = STATUS_COLORS[step.id];

    switch (step.status) {
      case "completed":
        return {
          bg: `${baseColors.bg} opacity-70`,
          text: `${baseColors.text} opacity-80`,
          border: `${baseColors.border} opacity-80`,
          icon: `${baseColors.icon} opacity-80`,
          line: `${baseColors.line} opacity-70`,
        };
      case "current":
        return {
          bg: `${baseColors.bg} shadow-md`,
          text: baseColors.text,
          border: `${baseColors.border} border-2`,
          icon: baseColors.icon,
          line: baseColors.line,
        };
      case "pending":
        return {
          bg: "bg-gray-50",
          text: "text-gray-500",
          border: "border-gray-200",
          icon: "text-gray-400",
          line: "bg-gray-200",
        };
    }
  };

  const formatDate = (dateString?: string, shortFormat = false) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: shortFormat ? "short" : "long",
      year: shortFormat ? undefined : "numeric",
      hour: shortFormat ? undefined : "2-digit",
      minute: shortFormat ? undefined : "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{t("titre")}</h3>

      {/* Timeline horizontale */}
      <div className="relative pb-4">
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
          {steps.map((step, index) => {
            const styles = getStatusStyles(step);
            const Icon = step.Icon || <></>;
            return (
              <div
                key={step.id}
                className="flex-shrink-0 px-2"
                style={{ width: "180px" }}
              >
                <div className="relative flex flex-col items-center">
                  {index > 0 && (
                    <div
                      className={`absolute left-0 top-5 h-0.5 w-8 -translate-x-full ${styles.line}`}
                    ></div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${styles.bg} ${styles.border}`}
                  >
                    {Icon}
                  </div>

                  <div className="text-center w-full">
                    <h4 className={`text-sm font-medium ${styles.text}`}>
                      {step.label}
                    </h4>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(step.date, true)}
                      </p>
                    )}
                    {step.status === "current" && (
                      <div
                        className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs ${styles.bg} ${styles.text}`}
                      >
                        <Clock className="w-3 h-3" />
                        {t("enCours")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description détaillée */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => {
          const styles = getStatusStyles(step);
          const Icon = step.Icon || <></>;
          return (
            step.description && (
              <div
                key={`desc-${step.id}`}
                className={`p-3 rounded-lg transition-all duration-300 ${styles.bg} border ${styles.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
                    {Icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${styles.text}`}>
                      {step.label}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(step.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
