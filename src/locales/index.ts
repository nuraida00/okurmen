import kg from './kg';
import ru from './ru';
import type { Language, Translations } from './types';

export const translations: Record<Language, Translations> = { kg, ru };

export function getTranslations(lang: Language): Translations {
  return translations[lang] ?? translations.kg;
}

export type { Language, Translations };
