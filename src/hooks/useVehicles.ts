'use client'
import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'
import type { PublicVehicleListResponse } from '@/types/public'

export type VehicleFilters = {
  q?: string
  brand?: string
  model?: string
  year?: number
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
}

export const useVehicles = (garageSlug: string, filters?: VehicleFilters) =>
  useQuery<PublicVehicleListResponse>({
    queryKey: ['vehicles', garageSlug, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      ;(
        Object.entries(filters || {}) as Array<[keyof VehicleFilters, unknown]>
      ).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          params.set(String(k), String(v))
      })
      const qs = params.toString()
      const url = `/v1/public/${garageSlug}/vehicles${qs ? `?${qs}` : ''}`
      const { data } = await apiPublic.get(url)
      return data as PublicVehicleListResponse
    },
    enabled: !!garageSlug,
    staleTime: 10_000,
  })
