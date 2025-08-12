import {toast} from "sonner";

export async function validateStepFields<T>(
    fields: (keyof T)[],
    validateField: (field: keyof T, mode: string) => Promise<void>,
    getAllErrors: () => { fields: Record<string, unknown> }
): Promise<boolean> {
    let isValid = true;

    for (const field of fields) {
        try {
            await validateField(field, "change");
        } catch (error: any) {
            isValid = false;
            toast.error(error?.message || "Erreur de validation pour \${String(field)}");
        }
    }
    const errors = getAllErrors();
    if (Object.keys(errors.fields).length > 0) {
        isValid = false;
    }
    return isValid;
}