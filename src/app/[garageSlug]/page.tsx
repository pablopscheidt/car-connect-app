'use client'
import React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useVehicles, type VehicleFilters } from '@/hooks/useVehicles'
import VehicleCard from '@/components/VehicleCard'
import { FilterBar } from '@/components/FilterBar'

function paramsToFilters(sp: URLSearchParams): VehicleFilters {
  return {
    q: sp.get('q') || undefined,
    brand: sp.get('brand') || undefined,
    model: sp.get('model') || undefined,
    year: sp.get('year') ? Number(sp.get('year')) : undefined,
    minPrice: sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined,
    maxPrice: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 12,
  }
}

export default function GarageHome({
  params,
}: {
  params: Promise<{ garageSlug: string }>
}) {
  const { garageSlug } = React.use(params)
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const filters = paramsToFilters(sp)
  const { data: veh, isLoading: loadingVehicles } = useVehicles(
    garageSlug,
    filters,
  )

  const updateQuery = (next: VehicleFilters) => {
    const nextSp = new URLSearchParams()
    ;(Object.entries(next) as Array<[keyof VehicleFilters, unknown]>).forEach(
      ([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          nextSp.set(String(k), String(v))
      },
    )
    router.replace(`${pathname}?${nextSp.toString()}`)
  }

  const onChangeFilters = (next: VehicleFilters) => updateQuery(next)
  const onSubmit = () => updateQuery(filters)
  const onClear = () => router.replace(pathname)

  const openVehicle = (id: string) =>
    router.push(`/${garageSlug}/vehicle/${id}`)

  return (
    <>
      <FilterBar
        value={filters}
        onChange={onChangeFilters}
        onSubmit={onSubmit}
        onClear={onClear}
      />

      {loadingVehicles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-t-2xl" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {veh && veh.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {veh.items.map((v) => (
            <VehicleCard
              key={v.id}
              id={v.id}
              brand={v.brand}
              model={v.model}
              version={v.version}
              yearModel={v.yearModel}
              coverUrl={v.coverUrl}
              priceOnRequest={v.priceOnRequest}
              price={v.price}
              onOpen={openVehicle}
            />
          ))}
        </div>
      )}

      {veh && veh.items.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          Nenhum veículo encontrado com estes filtros.
        </div>
      )}
    </>
  )
}
