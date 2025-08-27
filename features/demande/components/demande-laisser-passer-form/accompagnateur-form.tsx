import { useForm } from "@tanstack/react-form";
import { AccompagnateurDTO } from "../../schema/laissez-passer.schema";
import { revalidateLogic } from "@tanstack/react-form";
import { AccompagnateurSchema } from "../../schema/laissez-passer.schema";
import { InputField } from "@/components/form/input-field";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

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
            firstName: '',
            lastName: '',
            birthDate: '',
            birthPlace: '',
            nationality: '',
            domicile: '',
        },
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: { onChange: AccompagnateurSchema },
    });
    const t = useTranslations("AccompagnateurForm");

    return (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
            <h4 className="font-medium mb-4">
                {initialData ? t('edit') : t('new')}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { name: 'firstName', label: t('firstName'), type: 'text', placeholder: t('firstNamePlaceholder') },
                    { name: 'lastName', label: t('lastName'), type: 'text', placeholder: t('lastNamePlaceholder') },
                    { name: 'birthDate', label: t('birthDate'), type: 'date', placeholder: t('birthDatePlaceholder') },
                    { name: 'birthPlace', label: t('birthPlace'), type: 'text', placeholder: t('birthPlacePlaceholder') },
                    { name: 'nationality', label: t('nationality'), type: 'text', placeholder: t('nationalityPlaceholder') },
                    { name: 'domicile', label: t('domicile'), type: 'text', placeholder: t('domicilePlaceholder') },
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
                    {t('cancel')}
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
                    {t('save')}
                </Button>
            </div>
        </div>
    );
};
export default AccompagnateurForm;

