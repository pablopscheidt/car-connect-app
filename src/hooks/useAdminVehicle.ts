'use client'

import { useQuery } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { AdminVehicleDetail } from '@/types/admin-vehicles'

export const useAdminVehicle = (id: string | undefined) =>
  useQuery<AdminVehicleDetail>({
    queryKey: ['admin-vehicle', id],
    queryFn: async () => {
      const { data } = await apiAuth.get(`/v1/vehicles/${id}`)
      return data as AdminVehicleDetail
    },
    enabled: !!id,
  })
