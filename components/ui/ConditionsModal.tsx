"use client";

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentsLabel: string;
  conditionsList: string[];
  image?: string;
  extraNav?: React.ReactNode;
}

export default function ConditionsModal({
  isOpen,
  onClose,
  title,
  documentsLabel,
  conditionsList,
  image = '/assets/images/illustrations/formulaire/visa.png',
  extraNav
}: ConditionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-3xl mx-auto bg-white  rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-600  mb-4">{title}</h1>
          <div className="flex items-center justify-center gap-4">
            <Image 
              src="/assets/images/illustrations/formulaire/logo.png"
              alt="Chad Embassy Logo" 
              width={750}
              height={300}
              className="mx-2"
            />
          </div>
        </div>

        {/* Documents section */}
        <div className="mx-auto mb-8 text-primary  font-semibold flex items-start justify-start relative">
          <div>
            {documentsLabel}
          </div>
        </div>

        {/* Navigation spéciale (ex: passport) */}
        {extraNav && (
          <div className="mb-4">{extraNav}</div>
        )}

        {/* Conditions list and image */}
        <div className="flex flex-row items-center justify-between px-10 py-6">
          {/* Liste numérotée à gauche */}
          <div className="w-auto md:w-1/2">
            <ol className="list-decimal list-outside space-y-2 text-sm text-gray-700 ">
              {conditionsList.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ol>
          </div>

          {/* Image réduite au centre à droite */}
          <div className="w-1/2 hidden md:flex justify-center">
            <Image
              src={image}
              alt="Document"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="bg-transparent text-secondary border border-secondary px-6 py-2 rounded-full font-semibold hover:bg-[#fff0ed] transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
} 