"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import React from "react";
import { useRouter } from "next/navigation";

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  locale?: string;
  disabled?: boolean;
  external?: boolean;
  newTab?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function NavigationButton({
  href,
  children,
  className = '',
  onClick,
  disabled = false,
  external = false,
  newTab = false,
  variant = 'primary',
  size = 'md',
}: NavigationButtonProps) {
  const currentLocale = useLocale();
  const router = useRouter();

  // Styles par défaut selon la variante
  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300',
      ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-blue-300'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`;
  };

  const finalClassName = `${getVariantStyles()} ${className}`;

  // Gestion des liens externes
  if (external) {
    return (
      <a
        href={href}
        target={newTab ? '_blank' : '_self'}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={finalClassName}
        onClick={onClick}
      >
        {children}
        {newTab && (
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </a>
    );
  }

  // Force un slash initial pour les liens internes
  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  const finalHref = `/${currentLocale}${normalizedHref}`;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={finalHref} passHref>
      <button 
        type="button" 
        className={finalClassName}
        onClick={handleClick}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {children}
      </button>
    </Link>
  );
}
