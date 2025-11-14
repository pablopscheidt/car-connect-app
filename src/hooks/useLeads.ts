'use client'

import { useQuery } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { LeadListResponse } from '@/types/leads'

export type LeadFilters = {
  q?: string
  page?: number
  pageSize?: number
}

export const useLeads = (filters?: LeadFilters) =>
  useQuery<LeadListResponse>({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      ;(
        Object.entries(filters || {}) as Array<[keyof LeadFilters, unknown]>
      ).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          params.set(String(k), String(v))
      })

      const qs = params.toString()
      const url = `/v1/leads${qs ? `?${qs}` : ''}`

      const { data } = await apiAuth.get(url)
      return data as LeadListResponse
    },
  })
