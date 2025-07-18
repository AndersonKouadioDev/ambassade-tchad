"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-4 bg-blue-800 rounded-xl hover:bg-blue-900 p-3 w-fit">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white hover:text-white font-semibold transition-all"
      >
        <ArrowLeftIcon className="w-5 h-5" color='white' />
        Retour
      </button>
    </div>
  );
}