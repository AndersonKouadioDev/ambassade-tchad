'use client';
import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-gray-900 dark:text-white text-lg focus:outline-none transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="ml-2 text-2xl select-none transition-transform duration-200">
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[1000px] opacity-100 py-2 px-6' : 'max-h-0 opacity-0 py-0 px-6'} overflow-hidden`}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
} 