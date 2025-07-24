// import { FieldError, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { JustificationDocumentType } from '@/types/request.types';
// import React, { useEffect, useState } from "react";
// import { laissezPasserApi } from '@/lib/api-client';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// // Schéma de validation
// export const laissezPasserRequestDetailsSchema = z.object({
//   personFirstName: z.string().min(1, "Le prénom est requis"),
//   personLastName: z.string().min(1, "Le nom est requis"),
//   personBirthDate: z.string().min(1, "La date de naissance est requise")
//     .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
//   personBirthPlace: z.string().min(1, "Le lieu de naissance est requis"),
//   personProfession: z.string().optional(),
//   personNationality: z.string().min(1, "La nationalité est requise"),
//   personDomicile: z.string().optional(),
//   fatherFullName: z.string().optional(),
//   motherFullName: z.string().optional(),
//   destination: z.string().min(1, "La destination est requise"),
//   travelReason: z.string().min(1, "Le motif du voyage est requis"),
//   accompanied: z.boolean().default(false),
//   justificationDocumentType: z.nativeEnum(JustificationDocumentType).optional(),
//   justificationDocumentNumber: z.string().optional(),
//   laissezPasserExpirationDate: z.string().min(1, "La date d'expiration est requise")
//     .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
//   contactPhoneNumber: z.string().min(1, "Le numéro de contact est requis")
//     .regex(/^\+?[0-9\s\-]+$/, "Numéro de téléphone invalide"),
//   accompaniers: z.array(z.object({
//     firstName: z.string().min(1, "Le prénom est requis"),
//     lastName: z.string().min(1, "Le nom est requis"),
//     birthDate: z.string().min(1, "La date de naissance est requise")
//       .refine(val => !isNaN(new Date(val).getTime()), { message: "Date invalide" }),
//     birthPlace: z.string().min(1, "Le lieu de naissance est requis"),
//     nationality: z.string().min(1, "La nationalité est requise"),
//     domicile: z.string().optional(),
//   })).optional(),
// });

// type LaissezPasserFormInput = z.infer<typeof laissezPasserRequestDetailsSchema>;

// export default function LaissezPasserForm() {
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors }, 
//     setValue, 
//     trigger, 
//     watch,
//     reset,
//     control,
//     clearErrors
//   } = useForm<LaissezPasserFormInput>({
//     resolver: zodResolver(laissezPasserRequestDetailsSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       personFirstName: '',
//       personLastName: '',
//       personBirthDate: '',
//       personBirthPlace: '',
//       personProfession: '',
//       personNationality: '',
//       personDomicile: '',
//       fatherFullName: '',
//       motherFullName: '',
//       destination: '',
//       travelReason: '',
//       accompanied: false,
//       justificationDocumentType: undefined,
//       justificationDocumentNumber: '',
//       laissezPasserExpirationDate: '',
//       contactPhoneNumber: '',
//       accompaniers: [],
//     },
//   });

//   const totalSteps = 4;
//   const [currentStep, setCurrentStep] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [prixActe, setPrixActe] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const accompaniedValue = watch('accompanied');

//   // Récupération du prix
//   useEffect(() => {
//     async function fetchPrice() {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/demandes/services`);
//         const data = await res.json();
//         const service = Array.isArray(data) 
//           ? (data as any[]).find((s: any) => s.type === 'LAISSEZ_PASSER')
//           : Array.isArray(data.data) 
//             ? (data.data as any[]).find((s: any) => s.type === 'LAISSEZ_PASSER')
//             : null;
//         setPrixActe(service ? service.defaultPrice : null);
//       } catch (e) {
//         console.error('Erreur lors de la récupération du prix:', e);
//         setPrixActe(null);
//       }
//     }
//     fetchPrice();
//   }, []);

//   // Gestion des champs par étape
//   function getFieldsForStep(step: number): (keyof LaissezPasserFormInput)[] {
//     switch (step) {
//       case 1:
//         return ['personFirstName', 'personLastName', 'personBirthDate', 'personBirthPlace', 'justificationDocumentType'];
//       case 2:
//         return ['personNationality', 'personDomicile', 'fatherFullName', 'motherFullName', 'justificationDocumentNumber', 'contactPhoneNumber'];
//       case 3:
//         return ['destination', 'travelReason', 'accompanied', 'laissezPasserExpirationDate'];
//       case 4:
//         return accompaniedValue ? ['accompaniers'] : [];
//       default:
//         return [];
//     }
//   }

//   const nextStep = async () => {
//     const fieldsToValidate = getFieldsForStep(currentStep);
//     const isValidStep = await trigger(fieldsToValidate as any);
    
//     if (isValidStep && currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     } else if (!isValidStep) {
//       toast.error('Veuillez corriger les erreurs avant de continuer');
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const onSubmit = async (data: LaissezPasserFormInput) => {
//     setIsSubmitting(true);
//     try {
//       const { contactPhoneNumber, accompaniers, ...details } = data;
//       const payload = {
//         ...details,
//         personBirthDate: new Date(data.personBirthDate).toISOString(),
//         laissezPasserExpirationDate: new Date(data.laissezPasserExpirationDate).toISOString(),
//         accompaniers: accompaniers?.map(acc => ({
//           ...acc,
//           birthDate: new Date(acc.birthDate).toISOString()
//         }))
//       };

//       const response = await laissezPasserApi.create(
//         payload,
//         contactPhoneNumber,
//         uploadedFile ? [uploadedFile] : undefined
//       );

//       if (response.success) {
//         toast.success('Demande envoyée avec succès !');
//         reset();
//         setUploadedFile(null);
//         router.push('/espace-client');
//       } else {
//         toast.error(response.error || "Erreur lors de l'envoi de la demande");
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       toast.error('Une erreur est survenue lors de la soumission');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Rendu des étapes
//   const renderStep1 = () => (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
//           <input
//             {...register('personFirstName')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.personFirstName ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.personFirstName && (
//             <p className="text-red-500 text-xs mt-1">{errors.personFirstName.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
//           <input
//             {...register('personLastName')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.personLastName ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.personLastName && (
//             <p className="text-red-500 text-xs mt-1">{errors.personLastName.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
//           <input
//             type="date"
//             {...register('personBirthDate')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.personBirthDate ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.personBirthDate && (
//             <p className="text-red-500 text-xs mt-1">{errors.personBirthDate.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
//           <input
//             {...register('personBirthPlace')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.personBirthPlace ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.personBirthPlace && (
//             <p className="text-red-500 text-xs mt-1">{errors.personBirthPlace.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce justificative</label>
//           <select
//             {...register('justificationDocumentType')}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           >
//             <option value="">Sélectionnez</option>
//             {Object.values(JustificationDocumentType).map(type => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Nationalité et filiation</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
//           <input
//             {...register('personNationality')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.personNationality ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.personNationality && (
//             <p className="text-red-500 text-xs mt-1">{errors.personNationality.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Domicile</label>
//           <input
//             {...register('personDomicile')}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet du père</label>
//           <input
//             {...register('fatherFullName')}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet de la mère</label>
//           <input
//             {...register('motherFullName')}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de pièce justificative</label>
//           <input
//             {...register('justificationDocumentNumber')}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone *</label>
//           <input
//             {...register('contactPhoneNumber')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.contactPhoneNumber ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.contactPhoneNumber && (
//             <p className="text-red-500 text-xs mt-1">{errors.contactPhoneNumber.message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du voyage</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
//           <input
//             {...register('destination')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.destination ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.destination && (
//             <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Motif du voyage *</label>
//           <input
//             {...register('travelReason')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.travelReason ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.travelReason && (
//             <p className="text-red-500 text-xs mt-1">{errors.travelReason.message}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Accompagné(e)</label>
//           <select
//             {...register('accompanied', { setValueAs: v => v === 'true' })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           >
//             <option value="false">Non</option>
//             <option value="true">Oui</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration *</label>
//           <input
//             type="date"
//             {...register('laissezPasserExpirationDate')}
//             className={`w-full px-4 py-2 border rounded-md ${
//               errors.laissezPasserExpirationDate ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.laissezPasserExpirationDate && (
//             <p className="text-red-500 text-xs mt-1">{errors.laissezPasserExpirationDate.message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif et paiement</h3>
      
//       {accompaniedValue && (
//         <div className="mb-6 p-4 border rounded-lg bg-gray-50">
//           <h4 className="text-md font-semibold text-gray-800 mb-4">Informations sur l'accompagnateur</h4>
//           <div className="space-y-4">
//             {watch('accompaniers')?.map((_, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
//                   <input
//                     {...register(`accompaniers.${index}.firstName`)}
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.accompaniers?.[index]?.firstName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.accompaniers?.[index]?.firstName && (
//                     <p className="text-red-500 text-xs mt-1">{errors.accompaniers[index]?.firstName?.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
//                   <input
//                     {...register(`accompaniers.${index}.lastName`)}
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.accompaniers?.[index]?.lastName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.accompaniers?.[index]?.lastName && (
//                     <p className="text-red-500 text-xs mt-1">{errors.accompaniers[index]?.lastName?.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
//                   <input
//                     type="date"
//                     {...register(`accompaniers.${index}.birthDate`)}
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.accompaniers?.[index]?.birthDate ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.accompaniers?.[index]?.birthDate && (
//                     <p className="text-red-500 text-xs mt-1">{errors.accompaniers[index]?.birthDate?.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
//                   <input
//                     {...register(`accompaniers.${index}.birthPlace`)}
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.accompaniers?.[index]?.birthPlace ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.accompaniers?.[index]?.birthPlace && (
//                     <p className="text-red-500 text-xs mt-1">{errors.accompaniers[index]?.birthPlace?.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
//                   <input
//                     {...register(`accompaniers.${index}.nationality`)}
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.accompaniers?.[index]?.nationality ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {errors.accompaniers?.[index]?.nationality && (
//                     <p className="text-red-500 text-xs mt-1">{errors.accompaniers[index]?.nationality?.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Domicile</label>
//                   <input
//                     {...register(`accompaniers.${index}.domicile`)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => setValue('accompaniers', [...(watch('accompaniers') || []), {
//                 firstName: '',
//                 lastName: '',
//                 birthDate: '',
//                 birthPlace: '',
//                 nationality: '',
//                 domicile: ''
//               }])}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Ajouter un accompagnateur
//             </button>
//           </div>
//         </div>
//       )}
      
//       <div className="mb-4">
//         <span className="text-lg font-semibold text-green-700">
//           Prix à payer : {prixActe?.toLocaleString() ?? '10,000'} FCFA
//         </span>
//       </div>
      
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Pièce justificative (optionnel)
//         </label>
//         <input
//           type="file"
//           accept="image/*,.pdf"
//           onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         {uploadedFile && (
//           <div className="mt-2 text-sm text-gray-700">
//             Fichier sélectionné : {uploadedFile.name}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
//       <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
//         Formulaire de demande de Laissez-passer
//       </h1>
      
//       <div className="mb-6">
//         <div className="flex items-center">
//           {[...Array(totalSteps)].map((_, i) => (
//             <React.Fragment key={i}>
//               <div
//                 className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                   currentStep > i + 1
//                     ? 'bg-green-500 text-white'
//                     : currentStep === i + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 {i + 1}
//               </div>
//               {i < totalSteps - 1 && (
//                 <div
//                   className={`flex-1 h-1 mx-2 ${
//                     currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-200'
//                   }`}
//                 />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit as any)}>
//         {currentStep === 1 && renderStep1()}
//         {currentStep === 2 && renderStep2()}
//         {currentStep === 3 && renderStep3()}
//         {currentStep === 4 && renderStep4()}

//         <div className="flex justify-between items-center mt-6">
//           {currentStep > 1 && (
//             <button
//               type="button"
//               onClick={prevStep}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//             >
//               Précédent
//             </button>
//           )}
          
//           {currentStep < totalSteps ? (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Suivant
//             </button>
//           ) : (
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }