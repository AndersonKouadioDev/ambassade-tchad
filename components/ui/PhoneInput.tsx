'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Pays d'Afrique de l'Ouest avec leurs indicatifs téléphoniques
const WEST_AFRICAN_COUNTRIES = [
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinée-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'LR', name: 'Libéria', dialCode: '+231', flag: '🇱🇷' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PhoneInput({ 
  value, 
  onChange, 
  placeholder = "Numéro de téléphone", 
  className = "",
  required = false 
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(WEST_AFRICAN_COUNTRIES[2]); // Côte d'Ivoire par défaut
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialiser le numéro de téléphone
  useEffect(() => {
    if (value) {
      // Extraire le code pays et le numéro
      const country = WEST_AFRICAN_COUNTRIES.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.replace(country.dialCode, ''));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Formater le numéro de téléphone
  const formatPhoneNumber = (number: string, countryCode: string) => {
    const cleaned = number.replace(/\D/g, '');
    
    // Formatage spécifique par pays
    switch (countryCode) {
      case 'CI': // Côte d'Ivoire - 10 chiffres
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
        if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
      
      case 'NG': // Nigeria
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)}`;
      
      case 'GH': // Ghana
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)}`;
      
      default:
        // Formatage générique pour les autres pays
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input, selectedCountry.code);
    setPhoneNumber(formatted);
    
    // Construire le numéro complet avec l'indicatif
    const fullNumber = selectedCountry.dialCode + formatted.replace(/\s/g, '');
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: typeof WEST_AFRICAN_COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    // Mettre à jour le numéro avec le nouvel indicatif
    const fullNumber = country.dialCode + phoneNumber.replace(/\s/g, '');
    onChange(fullNumber);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Sélecteur de pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Dropdown des pays */}
          {isOpen && (
            <div className="absolute top-full left-0 z-50 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {WEST_AFRICAN_COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.dialCode}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Champ de saisie du numéro */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Aperçu du numéro complet */}
      {phoneNumber && (
        <div className="mt-1 text-xs text-gray-500">
          Numéro complet: {selectedCountry.dialCode} {phoneNumber}
        </div>
      )}
    </div>
  );
} 