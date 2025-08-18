"use client";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string; // ex: 'max-w-3xl', 'max-w-5xl', 'max-w-7xl'
}

export default function Modal({ open, onClose, children, maxWidth = "max-w-3xl" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
        aria-label="Fermer le modal"
      />
      {/* Modal content */}
      <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl ${maxWidth} w-full mx-4 p-0 animate-fade-in overflow-y-auto max-h-[90vh]`}>
        {/* Close button */}
        <button
          className="absolute top-4 right-12 text-gray-400 hover:text-gray-700 dark:hover:text-white text-4xl font-semibold p-2 z-10"
          onClick={onClose}
          aria-label="Fermer"
          type="button"
        >
          ×
        </button>
        <div className="p-0 md:p-6">{children}</div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
      `}</style>
    </div>
  );
} 