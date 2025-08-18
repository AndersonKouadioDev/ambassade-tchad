import { useForm } from "@tanstack/react-form";
import { AccompagnateurDTO } from "../../schema/laissez-passer.schema";
import { revalidateLogic } from "@tanstack/react-form";
import { AccompagnateurSchema } from "../../schema/laissez-passer.schema";
import { InputField } from "@/components/form/input-field";
import { Button } from "@heroui/react";

const AccompagnateurForm = ({
    onSave,
    onCancel,
    initialData,
}: {
    onSave: (data: AccompagnateurDTO) => Promise<void>;
    onCancel: () => void;
    initialData?: AccompagnateurDTO;
}) => {
    const { Field, getFieldValue } = useForm({
        defaultValues: initialData || {
            firstName: 'dd',
            lastName: 'dd',
            birthDate: '2000-01-01',
            birthPlace: 'Douala',
            nationality: 'Camerounais',
            domicile: 'Douala',
        },
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: { onChange: AccompagnateurSchema },
    });

    return (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
            <h4 className="font-medium mb-4">
                {initialData ? 'Modifier accompagnateur' : 'Nouvel accompagnateur'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'firstName', label: 'Prénom *', type: 'text', placeholder: 'ex: Mahamat' },
                    { name: 'lastName', label: 'Nom *', type: 'text', placeholder: 'ex: Doe' },
                    { name: 'birthDate', label: 'Date de naissance *', type: 'date', placeholder: 'ex: 2000-01-01' },
                    { name: 'birthPlace', label: 'Lieu de naissance *', type: 'text', placeholder: 'ex: Douala' },
                    { name: 'nationality', label: 'Nationalité *', type: 'text', placeholder: 'ex: Camerounais' },
                    { name: 'domicile', label: 'Domicile', type: 'text', placeholder: 'ex: Douala' },
                ].map((field) => (
                    <Field key={field.name} name={field.name as keyof AccompagnateurDTO}>
                        {({ state, handleChange, handleBlur }) => (
                            <InputField
                                label={field.label}
                                type={field.type}
                                value={state.value as string}
                                onChange={(value) => handleChange(value as string)}
                                onBlur={handleBlur}
                                errors={state.meta.errors?.[0]?.message}
                                required={field.label.includes('*')}
                            />
                        )}
                    </Field>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    onPress={onCancel}
                    color="danger"
                >
                    Annuler
                </Button>
                <Button
                    type="button"
                    color="primary"
                    onPress={() => onSave({
                        firstName: getFieldValue('firstName'),
                        lastName: getFieldValue('lastName'),
                        birthDate: getFieldValue('birthDate'),
                        birthPlace: getFieldValue('birthPlace'),
                        nationality: getFieldValue('nationality'),
                        domicile: getFieldValue('domicile'),
                    })}
                >
                    Enregistrer
                </Button>
            </div>
        </div>
    );
};
export default AccompagnateurForm;

