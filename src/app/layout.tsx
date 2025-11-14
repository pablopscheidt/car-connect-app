import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Car Connect',
  description: 'Software Web para Garagistas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
