export enum InputType {
    Text = 'text',
    FirstName = 'firstName',
    LastName = 'lastName',
    Address = 'address',
    Email = 'email',
    Phone = 'phone',
    PostalCode = 'postalCode',
    CardName = 'cardName',
}


export interface InputConfig {
    type: string,
    name: string,
    label: string
    autocomplete?: string,
    placeholder?: string,
    errorText?: string,
    validationFunction?: (input: string) => boolean;
}

export function isNotEmpty(value: string): boolean {
    return value.trim().length > 0
}

export function isValidName(value: string): boolean {
    const name = value.trim()

    if (name.length < 2) return false

    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(name)
}

export function isValidAddress(value: string): boolean {
    return value.trim().length >= 5
}

export function isValidEmail(value: string): boolean {
    if (!isNotEmpty(value)) return false

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isValidPhone(value: string): boolean {
    const cleaned = value.replace(/[^\d+]/g, '')

    if (!/^(\+?\d+)$/.test(cleaned)) return false

    return cleaned.replace(/\D/g, '').length >= 6
}


export function isValidPostalCode(value: string): boolean {
    return /^[0-9]{4,6}$/.test(value.trim())
}


export const inputSettings: Record<InputType, InputConfig> = {
    [InputType.Text]: {
        type: 'text',
        name: 'text',
        label: 'Text',
        autocomplete: 'off',
        placeholder: '',
        errorText: 'Dieses Feld ist erforderlich',
        validationFunction: isNotEmpty
    },
    [InputType.CardName]: {
        type: 'text',
        name: 'text',
        label: 'Kartenname (optional)',
        autocomplete: 'off',
        placeholder: '',
    },

    [InputType.FirstName]: {
        type: 'text',
        name: 'firstName',
        label: 'Vorname',
        autocomplete: 'given-name',
        placeholder: 'Max',
        errorText: 'Bitte geben Sie Ihren Vornamen ein',
        validationFunction: isValidName
    },

    [InputType.LastName]: {
        type: 'text',
        name: 'lastName',
        label: 'Nachname',
        autocomplete: 'family-name',
        placeholder: 'Mustermann',
        errorText: 'Bitte geben Sie Ihren Nachnamen ein',
        validationFunction: isValidName
    },

    [InputType.Address]: {
        type: 'text',
        name: 'address',
        label: 'Adresse',
        autocomplete: 'street-address',
        placeholder: 'Musterstraße 12',
        errorText: 'Bitte geben Sie Ihre Adresse ein',
        validationFunction: isValidAddress
    },

    [InputType.Email]: {
        type: 'email',
        name: 'email',
        label: 'E-Mail-Adresse',
        autocomplete: 'email',
        placeholder: 'max.mustermann@example.com',
        errorText: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        validationFunction: isValidEmail
    },

    [InputType.Phone]: {
        type: 'tel',
        name: 'phone',
        label: 'Telefonnummer',
        autocomplete: 'tel',
        placeholder: '+43 660 1234567',
        errorText: 'Bitte geben Sie eine gültige Telefonnummer ein',
        validationFunction: isValidPhone
    },

    [InputType.PostalCode]: {
        type: 'text',
        name: 'postalCode',
        label: 'Postleitzahl',
        autocomplete: 'postal-code',
        placeholder: '1010',
        errorText: 'Bitte geben Sie eine gültige Postleitzahl ein',
        validationFunction: isValidPostalCode
    }
}




