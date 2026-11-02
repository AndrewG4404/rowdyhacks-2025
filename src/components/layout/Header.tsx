'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '../ui/Button';

export function Header() {
  const t = useTranslations('nav');
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">GoLoanMe</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('explore')}
            </Link>
            <Link href="/wallet" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('wallet')}
            </Link>
            <Link href="/terms" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('terms')}
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/posts/new">
              <Button size="sm">
                {t('create')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

