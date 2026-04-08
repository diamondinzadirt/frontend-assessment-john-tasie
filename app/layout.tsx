import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { NavigationLoadingIndicator } from '@/components/navigation-loading-indicator';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Content Explorer - Product Listing',
  description:
    'Browse and explore our collection of premium products with advanced search and filtering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-blue-700 focus:shadow-md"
        >
          Skip to main content
        </a>
        <Suspense fallback={null}>
          <NavigationLoadingIndicator />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
