import { Button } from "@heroui/react";
import AccompagnateurForm from "./accompagnateur-form";
import { Field } from "@tanstack/react-form";

const renderStep2 = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations familiales et documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field name="fatherFullName">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Nom complet du père *"
                        placeholder="Ex: Pierre Dupont"
                        type="text"
                        value={state.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                        required
                    />
                )}
            </Field>

            <Field name="motherFullName">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Nom complet de la mère *"
                        placeholder="Ex: Marie Dupont"
                        type="text"
                        value={state.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                        required
                    />
                )}
            </Field>

            <Field name="justificationDocumentType">
                {({ state, handleChange, handleBlur }) => (
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type de document justificatif *
                        </label>
                        <select
                            value={state.value}
                            onChange={(e) => handleChange(e.target.value as DocumentJustificationType)}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-md ${state.meta.errors?.length ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            {Object.values(DocumentJustificationType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {state.meta.errors?.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {state.meta.errors[0]?.message}
                            </p>
                        )}
                    </div>
                )}
            </Field>

            <Field name="justificationDocumentNumber">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Numéro du document justificatif *"
                        placeholder="Ex: 123456789"
                        type="text"
                        value={state.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                        required
                    />
                )}
            </Field>

            <Field name="destination">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Destination"
                        placeholder="Ex: France"
                        type="text"
                        value={state.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                    />
                )}
            </Field>

            <Field name="travelReason">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Motif du voyage"
                        placeholder="Ex: Voyage d'affaires"
                        type="text"
                        value={state.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                    />
                )}
            </Field>

            <Field name="accompanied">
                {({ state, handleChange }) => (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="accompanied"
                            checked={state.value}
                            onChange={(e) => {
                                handleChange(e.target.checked);
                                setAccompanied(e.target.checked);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="accompanied" className="ml-2 block text-sm text-gray-900">
                            Voyage accompagné
                        </label>
                    </div>
                )}
            </Field>

            {accompanied && (
                <div className="col-span-full mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Accompagnateurs</h4>
                        <Button
                            onPress={() => {
                                setCurrentAccompagnateurIndex(null);
                                setShowAccompagnateurForm(true);
                            }}
                        >
                            + Ajouter
                        </Button>
                    </div>

                    {showAccompagnateurForm && (
                        <AccompagnateurForm
                            onSave={async (data) => {
                                console.log(data);
                                if (currentAccompagnateurIndex !== null) {
                                    // Modification
                                    const updated = [...accompaniers];
                                    updated[currentAccompagnateurIndex] = data;
                                    setAccompaniers(updated);
                                } else {
                                    // Ajout
                                    setAccompaniers([...accompaniers, data]);
                                }
                                setShowAccompagnateurForm(false);
                            }}
                            onCancel={() => setShowAccompagnateurForm(false)}
                            initialData={
                                currentAccompagnateurIndex !== null
                                    ? accompaniers[currentAccompagnateurIndex]
                                    : undefined
                            }
                        />
                    )}

                    {accompaniers.length > 0 ? (
                        <div className="space-y-2 mt-2">
                            {accompaniers.map((acc, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                                >
                                    <span>
                                        {acc.firstName} {acc.lastName} ({acc.nationality})
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            onPress={() => {
                                                setCurrentAccompagnateurIndex(index);
                                                setShowAccompagnateurForm(true);
                                            }}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                setAccompaniers(accompaniers.filter((_, i) => i !== index));
                                            }}
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mt-2">
                            Aucun accompagnateur ajouté
                        </p>
                    )}
                </div>
            )}
        </div>
    </div>
);
export default renderStep2;