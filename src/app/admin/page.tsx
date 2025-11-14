'use client'

import React from 'react'
import Link from 'next/link'
import { useLeads } from '@/hooks/useLeads'
import type { LeadItem } from '@/types/leads'
import { Skeleton } from '@/components/ui/Skeleton'

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

export default function AdminDashboardPage() {
  // Pego só os 5 últimos leads para o dashboard
  const { data, isLoading, isError } = useLeads({ page: 1, pageSize: 5 })

  const totalLeads = data?.total ?? 0
  const latestLeads = data?.items ?? []

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Visão geral rápida da sua garagem.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="h-9 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50 flex items-center"
          >
            Ver todos os leads
          </Link>
          {/* Futuro: /admin/vehicles */}
          <Link
            href="/admin/vehicles"
            className="h-9 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50 flex items-center"
          >
            Gerenciar veículos
          </Link>
        </div>
      </header>

      {/* Cards de resumo (por enquanto só leads) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
          <div className="text-sm text-gray-500">Leads recebidos</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {isLoading ? '...' : totalLeads}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Número total de contatos gerados pelo site.
          </div>
        </div>

        {/* Esses dois cards já deixam espaço pro futuro */}
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 flex items-center justify-center">
          Card reservado para estatísticas de veículos (em breve).
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 flex items-center justify-center">
          Card reservado para outras métricas (em breve).
        </div>
      </section>

      {/* Últimos leads */}
      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800">Últimos leads</h2>
          <span className="text-xs text-gray-400">
            {totalLeads > 0
              ? `${totalLeads} lead${totalLeads === 1 ? '' : 's'} no total`
              : 'Nenhum lead registrado ainda'}
          </span>
        </div>

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
          <div className="p-4 text-sm text-red-600">
            Não foi possível carregar os leads. Verifique se você está
            autenticado.
          </div>
        )}

        {!isLoading && !isError && latestLeads.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            Ainda não há leads cadastrados. Quando um cliente enviar interesse
            pelo site, eles aparecerão aqui.
          </div>
        )}

        {!isLoading && !isError && latestLeads.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {latestLeads.map((lead) => (
              <li
                key={lead.id}
                className="px-4 py-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500">
                    {lead.email && <span>{lead.email}</span>}
                    {lead.email && lead.phone && <span> • </span>}
                    {lead.phone && <span>{lead.phone}</span>}
                    {!lead.email && !lead.phone && (
                      <span>Sem contato informado</span>
                    )}
                  </div>
                  {lead.message && (
                    <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {lead.message}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
                  <span>{vehicleLabel(lead)}</span>
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {latestLeads.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-2 text-right">
            <Link
              href="/admin/leads"
              className="text-xs text-violet-700 hover:underline"
            >
              Ver todos os leads →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
