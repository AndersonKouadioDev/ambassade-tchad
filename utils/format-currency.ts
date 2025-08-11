/**
 * Formatte un nombre en une chaîne de caractères représentant une devise.
 *
 * @param {number} number - Le nombre à formatter.
 * @param {string} [currency=XOF] - Le code de la devise.
 * @param {string} [language=fr] - Le code de la langue.
 * @returns {string} La chaîne de caractères formatée.
 */
export const formatCurrency = (
    number: number,
    currency: string = "XOF",
    language: string = "fr"
): string => {
    return new Intl.NumberFormat(language, {
        style: "currency",
        currency: currency,
    }).format(number);
};