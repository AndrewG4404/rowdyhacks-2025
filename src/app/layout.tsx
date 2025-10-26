import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoLoanMe - Community Micro-Funding",
  description: "Help underserved communities raise and coordinate funds with trust and clarity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <div style={{ padding: '20px', background: '#e0f2fe', borderBottom: '2px solid #0ea5e9' }}>
          <h1 style={{ margin: 0, color: '#0369a1', fontSize: '24px', fontWeight: 'bold' }}>
            🚀 GoLoanMe - Simplified Layout
          </h1>
        </div>
        <main className="flex-1" style={{ padding: '20px' }}>
          {children}
        </main>
        <footer style={{ padding: '20px', background: '#fef3c7', borderTop: '2px solid #f59e0b', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#92400e' }}>
            ⚠️ Simulated currency. Not financial or legal advice.
          </p>
        </footer>
      </body>
    </html>
  );
}

