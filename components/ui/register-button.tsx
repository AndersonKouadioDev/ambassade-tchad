"use client";

import React from "react";
import { Button } from "@heroui/react";

type RegisterButtonProps = {
  email?: string;
  eventTitle?: string;
  eventDate?: string;
  className?: string;
  label?: string;
};

export default function RegisterButton({ 
  email,
  eventTitle,
  eventDate,
  className = "w-full sm:w-auto mt-2",
  label = "S'inscrire"
}: RegisterButtonProps) {
  const handleRegister = () => {
  
    if (email) {
      window.location.href = `mailto:${email}?subject=Inscription: ${eventTitle}&body=Bonjour, je souhaite m'inscrire à l'événement "${eventTitle}" du ${eventDate}.`;
    }
  };

  return (
    <Button
      onClick={handleRegister}
      color="primary"
      className={className}
    >
      {label}
    </Button>
  );
}
