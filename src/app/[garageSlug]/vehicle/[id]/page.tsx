'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useVehicle } from '@/hooks/useVehicle'
import Gallery from '@/components/Gallery'
import InterestModal from '@/components/InterestModal'
import { formatBRL } from '@/lib/format'

export default function VehicleDetailPage() {
  const params = useParams<{ garageSlug: string; id: string }>()
  const router = useRouter()
  const garageSlug = params.garageSlug
  const id = params.id

  const { data: v, isLoading, isError } = useVehicle(garageSlug, id)
  const [interestOpen, setInterestOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !v) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-gray-600">Veículo não encontrado.</p>
        <button
          type="button"
          className="mt-4 h-10 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </div>
    )
  }

  const title = `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ''}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <button
        type="button"
        className="text-sm text-gray-600 hover:text-gray-900"
        onClick={() => router.push(`/${garageSlug}`)}
      >
        ← Voltar para listagem
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Gallery images={v.images} title={title} />

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

          <div className="text-violet-700 text-xl font-semibold">
            {v.priceOnRequest || v.price === null
              ? 'Sob consulta'
              : formatBRL(v.price)}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <div className="text-gray-500">Ano</div>
              <div className="font-medium">
                {v.yearFabrication}/{v.yearModel}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-gray-500">Combustível</div>
              <div className="font-medium">{v.fuel}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-gray-500">Câmbio</div>
              <div className="font-medium">{v.gearbox}</div>
            </div>
            {v.color && (
              <div className="rounded-md border p-3">
                <div className="text-gray-500">Cor</div>
                <div className="font-medium">{v.color}</div>
              </div>
            )}
          </div>

          {v.description && (
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Descrição</div>
              <p className="text-gray-800 whitespace-pre-line">
                {v.description}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setInterestOpen(true)}
              className="h-11 px-5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition"
            >
              Tenho interesse
            </button>
          </div>

          {/* Contatos (se existirem) */}
          <div className="text-sm text-gray-600 pt-2">
            {v.garage.phoneWhatsapp && (
              <div>WhatsApp: {v.garage.phoneWhatsapp}</div>
            )}
            {v.garage.instagram && (
              <div>
                Instagram:{' '}
                <a
                  href={v.garage.instagram}
                  className="text-violet-700 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {v.garage.instagram}
                </a>
              </div>
            )}
            {v.garage.website && (
              <div>
                Site:{' '}
                <a
                  href={v.garage.website}
                  className="text-violet-700 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {v.garage.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <InterestModal
        open={interestOpen}
        onClose={() => setInterestOpen(false)}
        vehicleTitle={title}
        garageSlug={garageSlug}
        vehicleId={v.id}
      />
    </div>
  )
}
