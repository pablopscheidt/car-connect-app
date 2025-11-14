'use client'
import { useQuery } from '@tanstack/react-query'
import { apiPublic } from '@/lib/api'
import type { PublicVehicleDetail } from '@/types/public'

export const useVehicle = (garageSlug: string, id: string) =>
  useQuery<PublicVehicleDetail>({
    queryKey: ['vehicle', garageSlug, id],
    queryFn: async () => {
      const { data } = await apiPublic.get(
        `/v1/public/${garageSlug}/vehicles/${id}`,
      )
      return data as PublicVehicleDetail
    },
    enabled: Boolean(garageSlug && id),
  })
