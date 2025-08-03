"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import React from "react";

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  locale?: string;
}

export default function NavigationButton({
  href,
  children,
  className,
  onClick,
  locale,
}: NavigationButtonProps) {
  const currentLocale = useLocale();
  const finalLocale = currentLocale;

  // Force un slash initial
  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  const finalHref = `/${finalLocale}${normalizedHref}`;

  return (
    <Link href={finalHref} passHref>
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    </Link>
  );
}
