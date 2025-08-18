'use client';

import { FileText, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ComingSoonFormProps {
  title: string;
  description: string;
  processingTime: string;
  onBack?: () => void;
}

export default function ComingSoonForm({ 
  title, 
  description, 
  processingTime, 
  onBack 
}: ComingSoonFormProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/espace-client/nouvelle-demande');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Durée de traitement estimée
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {processingTime}
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la sélection
          </button>
          
          <button
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            onClick={() => router.push('/espace-client/mes-demandes')}
          >
            Voir mes demandes existantes
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> Ce formulaire sera bientôt disponible. 
            Nous travaillons actuellement sur sa mise en place pour vous offrir 
            le meilleur service possible.
          </p>
        </div>
      </div>
    </div>
  );
} 