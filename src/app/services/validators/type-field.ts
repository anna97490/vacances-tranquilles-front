/**
 * Validateurs personnalisés pour les champs de formulaire
 * Cette classe fournit des méthodes statiques pour valider différents champs de formulaire tels que les noms, les emails, les numéros de téléphone, les codes postaux et les numéros SIRET/SIREN.
 * Chaque méthode utilise une expression régulière pour vérifier si la valeur saisie correspond au format attendu.
 */
export class CustomValidators {
    // Regex patterns
    private static readonly namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    private static readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private static readonly phoneNumberPattern = /^\+?[0-9]{10,15}$/;
    private static readonly postalCodePattern = /^[0-9]{5}$/;
    private static readonly siretSirenPattern = /^[0-9]{9,14}$/;
    // Pattern pour détecter les caractères dangereux pour les injections
    private static readonly injectionPattern = /[<>'"&;{}()\[\]\\\/|`~!@#$%^&*+=]/;

    // Validator functions
    static nameValidator(value: string): boolean {
        return this.namePattern.test(value);
    }

    static emailValidator(value: string): boolean {
        return this.emailPattern.test(value);
    }

    static phoneNumberValidator(value: string): boolean {
        return this.phoneNumberPattern.test(value);
    }

    static postalCodeValidator(value: string): boolean {
        return this.postalCodePattern.test(value);
    }

    static siretSirenValidator(value: string): boolean {
        return this.siretSirenPattern.test(value);
    }

    /**
     * Validateur pour empêcher les caractères spéciaux d'injection
     * @param value La valeur à valider
     * @returns true si la valeur ne contient pas de caractères dangereux, false sinon
     */
    static injectionPreventionValidator(value: string): boolean {
        if (!value) return true;
        return !this.injectionPattern.test(value);
    }
}
