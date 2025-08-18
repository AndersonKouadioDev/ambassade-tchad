
export interface ActionResult<T> {
    data?: T | null;
    message?: string;
    errors?: {
        [key: string]: string;
    };
    status?: 'idle' | 'loading' | 'success' | 'error'|'otp_required';
    code?: string | number;
}
