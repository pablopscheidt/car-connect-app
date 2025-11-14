'use client'

import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type {
  AdminVehicleFormInput,
  AdminVehicleDetail,
} from '@/types/admin-vehicles'

export function useUpdateVehicle(id: string) {
  return useMutation({
    mutationFn: async (payload: AdminVehicleFormInput) => {
      const { data } = await apiAuth.put<AdminVehicleDetail>(
        `/v1/vehicles/${id}`,
        payload,
      )
      return data
    },
  })
}
