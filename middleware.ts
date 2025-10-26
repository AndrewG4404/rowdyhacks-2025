import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false // Force English as default
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

