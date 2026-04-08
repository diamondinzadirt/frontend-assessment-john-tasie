import type { Metadata } from 'next'
import { Suspense } from 'react'
import { NavigationLoadingIndicator } from '@/components/navigation-loading-indicator'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Explorer - Product Listing',
  description: 'Browse and explore our collection of premium products with advanced search and filtering',
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
