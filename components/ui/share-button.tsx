"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  title?: string;
  text?: string;
  className?: string;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  label?: string;
};

export default function ShareButton({ 
  title, 
  text, 
  className = "", 
  variant = "bordered",
  label = "Partager"
}: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: window.location.href,
      });
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papier");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      startContent={<Share2 size={16} />}
      className={className}
    >
      {label}
    </Button>
  );
}
