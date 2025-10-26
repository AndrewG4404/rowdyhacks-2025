// GoLoanMe - i18n Configuration (next-intl)
// Supports English and Spanish

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

