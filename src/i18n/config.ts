export const locales = [
  'en', // English
  'es', // Spanish
  'fr', // French
  'de', // German
  'pt', // Portuguese
  'it', // Italian
  'zh-CN', // Chinese Simplified
  'zh-TW', // Chinese Traditional
  'ja', // Japanese
  'ko', // Korean
  'ru', // Russian
  'ar', // Arabic
  'hi', // Hindi
  'nl', // Dutch
  'tr', // Turkish
  'pl', // Polish
  'sv', // Swedish
  'no', // Norwegian
  'da', // Danish
  'id', // Indonesian
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
  nl: 'Nederlands',
  tr: 'Türkçe',
  pl: 'Polski',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  id: 'Bahasa Indonesia',
}

