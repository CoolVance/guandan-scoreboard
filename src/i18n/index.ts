import zh from './zh';
import en from './en';
import tw from './tw';

export type Lang = 'zh' | 'en' | 'tw';
export const DEFAULT_LANG: Lang = 'zh';

export type TranslationKey = keyof typeof zh.translations;

export const LANGUAGES: Record<Lang, { name: string; translations: Record<string, string> }> = {
    zh,
    en,
    tw
};

export const TRANSLATIONS = {
    zh: zh.translations,
    en: en.translations,
    tw: tw.translations
};
