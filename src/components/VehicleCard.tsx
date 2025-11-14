import React from 'react'
import { absUrl, formatBRL } from '@/lib/format'
import Image from 'next/image'

export type VehicleCardProps = {
  id: string
  brand: string
  model: string
  version?: string | null
  yearModel: number
  coverUrl: string | null
  priceOnRequest: boolean
  price: number | null
  onOpen: (id: string) => void
}

export default function VehicleCard(props: VehicleCardProps) {
  const {
    id,
    brand,
    model,
    version,
    yearModel,
    coverUrl,
    priceOnRequest,
    price,
    onOpen,
  } = props
  const title = `${brand} ${model}`

  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="w-full text-left rounded-2xl border border-gray-200 hover:shadow-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-gray-100">
        {coverUrl ? (
          <Image
            src={absUrl(coverUrl)}
            alt={title}
            className="h-full w-full object-cover"
            width={400}
            height={300}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <span className="text-sm text-gray-500">{yearModel}</span>
        </div>
        {version ? (
          <p className="text-sm text-gray-500 line-clamp-1">{version}</p>
        ) : null}

        <div className="pt-1">
          {priceOnRequest || price === null ? (
            <span className="text-violet-700 font-semibold">Sob consulta</span>
          ) : (
            <span className="text-violet-700 font-semibold">
              {formatBRL(price)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
