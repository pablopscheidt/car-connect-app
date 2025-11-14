'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { AdminGarageProfile } from '@/types/admin-garage'

export const useGarageProfile = () =>
  useQuery<AdminGarageProfile>({
    queryKey: ['garage-profile'],
    queryFn: async () => {
      const { data } = await apiAuth.get('/v1/garage/me')
      return data as AdminGarageProfile
    },
  })

export const useUpdateGarageProfile = () =>
  useMutation({
    mutationFn: async (payload: AdminGarageProfile) => {
      const { data } = await apiAuth.put('/v1/garage/me', payload)
      return data as AdminGarageProfile
    },
  })
