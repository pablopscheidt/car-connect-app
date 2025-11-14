'use client'
import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'
import type { GaragePublic } from '@/types/public'

export const useGarage = (garageSlug: string) =>
  useQuery<GaragePublic>({
    queryKey: ['garage', garageSlug],
    queryFn: async () => {
      const { data } = await apiPublic.get(`/v1/public/${garageSlug}/garage`)
      return data as GaragePublic
    },
    enabled: !!garageSlug,
  })
