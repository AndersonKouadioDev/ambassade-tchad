import { toast } from "sonner";

interface FormSubmitOptions<TData> {
    data: TData;
    files: File[];
    requiredDocumentsCount: number;
    createMutation: (params: { data: TData & { documents: File[] } }) => Promise<unknown>;
    onSuccess: () => void;
    errorMessage?: string;
}

export async function handleFormSubmit<TData>({
    data,
    files,
    requiredDocumentsCount,
    createMutation,
    onSuccess,
    errorMessage = "Une erreur est survenue lors de la création de la demande."
}: FormSubmitOptions<TData>): Promise<void> {
    // Validation des documents
    if (files.length < requiredDocumentsCount) {
        toast.error(`Veuillez télécharger tous ${requiredDocumentsCount} documents requis`);
        return;
    }

    try {
        const dataWithDocuments = {
            ...data,
            documents: files,
        } as TData & { documents: File[] };

        await createMutation({ data: dataWithDocuments });
        onSuccess();
    } catch (error) {

    }
}