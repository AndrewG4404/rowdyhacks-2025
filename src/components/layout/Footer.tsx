'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="bg-yellow-50 border-t-2 border-yellow-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700 text-center md:text-left">
            {t('disclaimer')}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>© 2025 GoLoanMe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

