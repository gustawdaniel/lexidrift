export type Role = 'admin' | 'user';
// export type Language = 'en' | 'es' | 'pl' | 'de' | 'ru';

export interface User {
    id: string;
    avatar: string;
    email: string;
    fullName: string;
    roles: Role[];
    language: Language;
    defaultLanguageToLearn: Language;
    createdAt: string;
}

export interface AuthorizationSuccessResponse {
    token: string;
    user: User
}

export const availableLanguages = [
    'en',
    'es',
    'pl',
    'de',
    'ru',
] as const;

export const availableLanguagesMap: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    pl: 'Polish',
    de: 'German',
    ru: 'Russian',
}

export type Language = typeof availableLanguages[number];