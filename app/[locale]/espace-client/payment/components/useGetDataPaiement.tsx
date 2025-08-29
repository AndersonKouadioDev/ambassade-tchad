"use client";

import { useSearchParams } from "next/navigation";

const useGetDataPaiement = () => {
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount"));
  const ticketNumber = searchParams.get("ticketNumber") as string;

  const isValid = amount && ticketNumber;

  return {
    amount,
    ticketNumber,
    isValid,
  };
};

export default useGetDataPaiement;
