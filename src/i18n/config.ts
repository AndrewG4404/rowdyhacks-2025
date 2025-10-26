// GoLoanMe - i18n Configuration (next-intl)
// Supports English and Spanish

import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  // If invalid, fall back to default locale instead of calling notFound()
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});

