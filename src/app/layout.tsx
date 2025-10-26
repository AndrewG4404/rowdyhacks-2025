// GoLoanMe - Root Layout
// Minimal layout for backend - frontend teammate will extend

import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'GoLoanMe - Community Micro-Funding',
  description: 'Simulated community funding platform with GLM credits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

