'use client'

import { useQuery } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { AdminVehicleListResponse } from '@/types/admin-vehicles'

export type AdminVehicleFilters = {
  q?: string
  status?: string
  page?: number
  pageSize?: number
}

export const useAdminVehicles = (filters?: AdminVehicleFilters) =>
  useQuery<AdminVehicleListResponse>({
    queryKey: ['admin-vehicles', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      Object.entries(filters || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          params.set(String(k), String(v))
      })

      const qs = params.toString()
      const url = `/v1/vehicles/admin${qs ? `?${qs}` : ''}`

      const { data } = await apiAuth.get(url)
      return data as AdminVehicleListResponse
    },
  })
