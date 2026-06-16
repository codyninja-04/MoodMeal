import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { brand } from '@/lib/brand';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: `${brand.name} — eat for how you feel`,
  description: `Tell us how you feel, not what you want. ${brand.name} recommends meals backed by the science of the mood-food relationship, then finds them near you.`,
};

export const viewport: Viewport = {
  themeColor: '#0e0e10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* White-label accent: override the default brand colour at the root. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--brand-rgb:${brand.accentRgb}}`,
          }}
        />
        {/* Respect the OS theme without a flash of the wrong one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
