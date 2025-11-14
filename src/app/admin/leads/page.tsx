'use client'

import React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useLeads, type LeadFilters } from '@/hooks/useLeads'
import type { LeadItem } from '@/types/leads'
import { Skeleton } from '@/components/ui/Skeleton'

function paramsToFilters(sp: URLSearchParams): LeadFilters {
  return {
    q: sp.get('q') || undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 20,
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

const vehicleLabel = (lead: LeadItem): string => {
  if (!lead.vehicle) return '—'
  const v = lead.vehicle
  return `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ''} (${v.yearModel})`
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const filters = paramsToFilters(sp)
  const { data, isLoading, isError, error } = useLeads(filters)

  const updateQuery = (next: LeadFilters) => {
    const nextSp = new URLSearchParams()
    ;(Object.entries(next) as Array<[keyof LeadFilters, unknown]>).forEach(
      ([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          nextSp.set(String(k), String(v))
      },
    )
    router.replace(`${pathname}?${nextSp.toString()}`)
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateQuery({ ...filters, q: e.target.value || undefined, page: 1 })
  }

  const goToPage = (page: number) => {
    if (page < 1) return
    updateQuery({ ...filters, page })
  }

  const total = data?.total ?? 0
  const page = data?.page ?? filters.page ?? 1
  const pageSize = data?.pageSize ?? filters.pageSize ?? 20
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500">
            Contatos recebidos através do site público.
          </p>
        </div>
        <div className="w-32 text-right text-xs text-gray-400">
          {total > 0
            ? `${total} lead${total === 1 ? '' : 's'}`
            : 'Nenhum lead ainda'}
        </div>
      </header>

      {/* Filtros */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-80">
          <label className="block text-sm text-gray-600 mb-1">Buscar</label>
          <input
            type="text"
            defaultValue={filters.q ?? ''}
            onChange={onSearchChange}
            placeholder="Nome, e-mail ou telefone"
            className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </section>

      {/* Conteúdo */}
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
          <div className="p-6 text-red-600 text-sm">
            Erro ao carregar leads. Verifique se você está autenticado.
            <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap">
              {String(error.message)}
            </pre>
          </div>
        )}

        {!isLoading && !isError && data && data.items.length === 0 && (
          <div className="p-6 text-gray-500 text-sm">
            Nenhum lead encontrado.
          </div>
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Nome
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Contato
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Veículo
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Criado em
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-b-0 border-gray-100"
                  >
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium text-gray-900">
                        {lead.name}
                      </div>
                      {lead.message && (
                        <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {lead.message}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {lead.email && <div>{lead.email}</div>}
                      {lead.phone && <div>{lead.phone}</div>}
                      {!lead.email && !lead.phone && (
                        <div className="text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {vehicleLabel(lead)}
                    </td>
                    <td className="px-4 py-2 align-top text-gray-700">
                      {formatDate(lead.createdAt)}
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
