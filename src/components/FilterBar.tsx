import React from 'react'
import type { VehicleFilters } from '@/hooks/useVehicles'

export type FilterBarProps = {
  value: VehicleFilters
  onChange: (next: VehicleFilters) => void
  onSubmit: () => void
  onClear: () => void
}

export function FilterBar({
  value,
  onChange,
  onSubmit,
  onClear,
}: FilterBarProps) {
  const set = <K extends keyof VehicleFilters>(
    key: K,
    v: VehicleFilters[K],
  ) => {
    onChange({ ...value, [key]: v })
  }

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const clear = () => onClear()

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end"
    >
      <div className="col-span-2 md:col-span-2">
        <label className="block text-sm text-gray-600 mb-1">Busca</label>
        <input
          type="text"
          value={value.q ?? ''}
          onChange={(e) => set('q', e.target.value || undefined)}
          placeholder="Marca, modelo, versão"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Marca</label>
        <input
          type="text"
          value={value.brand ?? ''}
          onChange={(e) => set('brand', e.target.value || undefined)}
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Modelo</label>
        <input
          type="text"
          value={value.model ?? ''}
          onChange={(e) => set('model', e.target.value || undefined)}
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Ano</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.year ?? ''}
          onChange={(e) =>
            set('year', e.target.value ? Number(e.target.value) : undefined)
          }
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Preço mín</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.minPrice ?? ''}
          onChange={(e) =>
            set('minPrice', e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="ex.: 40000"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Preço máx</label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={value.maxPrice ?? ''}
          onChange={(e) =>
            set('maxPrice', e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="ex.: 80000"
          className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="col-span-2 md:col-span-6 flex gap-2">
        <button
          type="submit"
          className="h-10 px-4 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          onClick={clear}
          className="h-10 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition"
        >
          Limpar
        </button>
      </div>
    </form>
  )
}
