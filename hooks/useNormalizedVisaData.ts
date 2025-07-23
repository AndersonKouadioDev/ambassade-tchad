// hooks/useVisaRequestNormalizer.ts
import { CreateVisaRequestInput } from "@/types/request.input";
import { format } from "date-fns";

export function useVisaRequestNormalizer() {
  const normalize = (data: CreateVisaRequestInput) => {
    const visaType = data.durationMonths <= 3 ? "SHORT_STAY" : "LONG_STAY";

    return {
      ...data,
      personBirthDate: data.personBirthDate
        ? format(new Date(data.personBirthDate), "yyyy-MM-dd")
        : undefined,
      passportIssueDate: data.passportIssueDate
        ? format(new Date(data.passportIssueDate), "yyyy-MM-dd")
        : undefined,
      passportExpirationDate: data.passportExpirationDate
        ? format(new Date(data.passportExpirationDate), "yyyy-MM-dd")
        : undefined,
      visaExpirationDate: data.visaExpirationDate
        ? format(new Date(data.visaExpirationDate), "yyyy-MM-dd")
        : undefined,
      requestId: data.requestId,
      visaType,
      durationMonths: data.durationMonths,
    };
  };

  return { normalize };
}
