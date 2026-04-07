import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NavigationLoadingIndicator } from '@/components/navigation-loading-indicator'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Explorer - Product Listing',
  description: 'Browse and explore our collection of premium products with advanced search and filtering',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <NavigationLoadingIndicator />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
