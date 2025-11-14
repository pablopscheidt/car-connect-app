'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  useAdminVehicles,
  type AdminVehicleFilters,
} from '@/hooks/useAdminVehicles'
import type { AdminVehicleListItem } from '@/types/admin-vehicles'
import { formatBRL } from '@/lib/format'
import { Skeleton } from '@/components/ui/Skeleton'

const statusLabel = (status: string): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'Em estoque'
    case 'SOLD':
      return 'Vendido'
    default:
      return status
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { dateStyle: 'short' })

const vehicleTitle = (v: AdminVehicleListItem) =>
  `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ''}`

const paramsToFilters = (sp: URLSearchParams): AdminVehicleFilters => ({
  q: sp.get('q') || undefined,
  status: sp.get('status') || undefined,
  page: sp.get('page') ? Number(sp.get('page')) : 1,
  pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 20,
})

export default function AdminVehiclesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const filters = paramsToFilters(sp)
  const { data, isLoading, isError, error } = useAdminVehicles(filters)

  const updateQuery = (next: AdminVehicleFilters) => {
    const nextSp = new URLSearchParams()
    ;(
      Object.entries(next) as Array<[keyof AdminVehicleFilters, unknown]>
    ).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '')
        nextSp.set(String(k), String(v))
    })
    router.replace(`${pathname}?${nextSp.toString()}`)
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateQuery({ ...filters, q: e.target.value || undefined, page: 1 })
  }

  const onStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value || undefined
    updateQuery({ ...filters, status: value, page: 1 })
  }

  const goToPage = (page: number) => {
    if (page < 1) return
    updateQuery({ ...filters, page })
  }

  const total = data?.total ?? 0
  const page = data?.page ?? filters.page ?? 1
  const pageSize = data?.pageSize ?? filters.pageSize ?? 20
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1

  const handleEdit = (vehicle: AdminVehicleListItem) => {
    router.push(`/admin/vehicles/${vehicle.id}/edit`)
  }

  const handleMedia = (vehicle: AdminVehicleListItem) => {
    router.push(`/admin/vehicles/${vehicle.id}/images`)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
          <p className="text-sm text-gray-500">
            Gerencie os veículos visíveis no site da garagem.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/vehicles/new"
            className="h-9 px-4 rounded-md bg-violet-600 text-white text-sm flex items-center hover:bg-violet-700"
          >
            Novo veículo
          </Link>
        </div>
      </header>

      {/* Filtros */}
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:w-80">
          <label className="block text-sm text-gray-600 mb-1">Buscar</label>
          <input
            type="text"
            defaultValue={filters.q ?? ''}
            onChange={onSearchChange}
            placeholder="Marca, modelo ou versão"
            className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="w-full md:w-48">
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={filters.status ?? ''}
            onChange={onStatusChange}
            className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Todos</option>
            <option value="IN_STOCK">Em estoque</option>
            <option value="SOLD">Vendido</option>
          </select>
        </div>
      </section>

      {/* Lista */}
      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {isLoading && (
          <div className="p-6">
            <div className="mb-4 flex gap-3">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className="p-6 text-sm text-red-600">
            Erro ao carregar veículos.
            <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap">
              {String((error as Error).message)}
            </pre>
          </div>
        )}

        {!isLoading && !isError && data && data.items.length === 0 && (
          <div className="p-6 text-gray-500 text-sm">
            Nenhum veículo encontrado. Cadastre um novo veículo usando o botão
            &quot;Novo veículo&quot;.
          </div>
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Veículo
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Ano
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Preço
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Criado em
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b last:border-b-0 border-gray-100"
                  >
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium text-gray-900">
                        {vehicleTitle(v)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {v.priceOnRequest
                          ? 'Sob consulta'
                          : v.price !== null
                            ? formatBRL(v.price)
                            : 'Sem preço'}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {v.yearFabrication}/{v.yearModel}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {v.priceOnRequest
                        ? 'Sob consulta'
                        : v.price !== null
                          ? formatBRL(v.price)
                          : '—'}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {statusLabel(v.status)}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {formatDate(v.createdAt)}
                    </td>
                    <td className="px-4 py-2 align-top text-right">
                      <button
                        type="button"
                        onClick={() => handleMedia(v)}
                        className="h-8 mr-2 px-3 rounded-md border border-gray-300 text-xs hover:bg-gray-50"
                      >
                        Mídias
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(v)}
                        className="h-8 px-3 rounded-md border border-gray-300 text-xs hover:bg-gray-50"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
              <div>
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="h-8 px-3 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="h-8 px-3 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
