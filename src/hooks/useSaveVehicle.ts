'use client'

import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type {
  AdminVehicleFormInput,
  AdminVehicleListItem,
} from '@/types/admin-vehicles'

export function useCreateVehicle() {
  return useMutation({
    mutationFn: async (payload: AdminVehicleFormInput) => {
      const { data } = await apiAuth.post<AdminVehicleListItem>(
        '/v1/vehicles',
        payload,
      )
      return data
    },
  })
}
