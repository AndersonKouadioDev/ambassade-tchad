import {toast} from "sonner";

type ValidationCause = "change" | "blur" | "submit";

export async function validateStepFields<TFieldName extends string>(
    fields: TFieldName[],
    validateField: (field: TFieldName, cause: ValidationCause) => Promise<unknown[]> | unknown[],
    getAllErrors: () => { fields: Record<string, unknown> }
): Promise<boolean> {
    let isValid = true;

    for (const field of fields) {
        try {
            await validateField(field, "change");
        } catch (error: unknown) {
            isValid = false;
            const errorMessage = error instanceof Error ? error.message : `Erreur de validation pour ${field}`;
            toast.error(errorMessage);
        }
    }

    const errors = getAllErrors();
    if (Object.keys(errors.fields).length > 0) {
        isValid = false;
    }

    return isValid;
}