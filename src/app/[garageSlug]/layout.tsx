'use client'

import { useGarage } from '@/hooks/useGarage'
import { Phone } from 'lucide-react'
import { use } from 'react'

export default function GarageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ garageSlug: string }>
}) {
  const { garageSlug } = use(params)
  const { data: garage } = useGarage(garageSlug)

  const primary = garage?.themePrimaryColor || '#6C2BD9'

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: primary }}>
                    {garage?.name ?? 'Garagem'}
                  </h1>
                  {garage?.city && (
                    <p className="text-sm text-gray-500">
                      {garage.city}
                      {garage.state ? `, ${garage.state}` : ''}
                    </p>
                  )}
                </div>
                {garage?.phoneWhatsapp && (
                  <div className="flex items-center gap-4">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primary }}
                    >
                      <Phone className="m-1 h-4 w-4 text-white" />
                    </div>
                    <span>{garage.phoneWhatsapp}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
