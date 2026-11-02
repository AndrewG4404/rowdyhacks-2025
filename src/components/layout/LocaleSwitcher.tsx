'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'en' | 'es') => {
    if (isPending || locale === newLocale) return;

    startTransition(() => {
      const pathnameWithoutLocale = pathname.startsWith(`/${locale}`)
        ? pathname.slice(`/${locale}`.length)
        : pathname;

      const newPathname = newLocale === 'en' 
        ? pathnameWithoutLocale || '/'
        : `/es${pathnameWithoutLocale || '/'}`;

      router.replace(newPathname);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded font-medium transition-all duration-200 ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        disabled={isPending}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('es')}
        className={`px-3 py-1 rounded font-medium transition-all duration-200 ${
          locale === 'es'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        disabled={isPending}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
}

