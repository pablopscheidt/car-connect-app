'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { VehicleImage } from '@/types/admin-vehicle-images'

const key = (vehicleId: string) => ['vehicle-images', vehicleId]

export const useVehicleImages = (vehicleId: string | undefined) =>
  useQuery<VehicleImage[]>({
    queryKey: key(vehicleId || 'unknown'),
    queryFn: async () => {
      const { data } = await apiAuth.get(`/v1/vehicles/${vehicleId}/images`)
      return data as VehicleImage[]
    },
    enabled: !!vehicleId,
  })

/**
 * Envia vários arquivos em UM request usando o campo 'files'
 * Opção: setFirstAsCoverIfEmpty => se o veículo não tem imagens ainda,
 * define a PRIMEIRA enviada como capa (coverIndex=0)
 */
export function useUploadVehicleImages(vehicleId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (args: {
      files: File[]
      setFirstAsCoverIfEmpty?: boolean
      hasExisting?: boolean
    }) => {
      const { files, setFirstAsCoverIfEmpty, hasExisting } = args
      if (!files.length) return

      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))

      const params = new URLSearchParams()
      if (setFirstAsCoverIfEmpty && !hasExisting) {
        params.set('coverIndex', '0') // primeira imagem do lote vira capa
      }

      const qs = params.toString()
      const url = `/v1/vehicles/${vehicleId}/images${qs ? `?${qs}` : ''}`

      await apiAuth.post(url, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(vehicleId) }),
  })
}

export function useSetCoverImage(vehicleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (imageId: string) => {
      await apiAuth.patch(
        `/v1/vehicles/${vehicleId}/images/${imageId}/cover`,
        {},
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(vehicleId) }),
  })
}

export function useDeleteVehicleImage(vehicleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (imageId: string) => {
      await apiAuth.delete(`/v1/vehicles/${vehicleId}/images/${imageId}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(vehicleId) }),
  })
}

export function useReorderVehicleImages(vehicleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await apiAuth.patch(`/v1/vehicles/${vehicleId}/images/reorder`, {
        ids: orderedIds,
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key(vehicleId) }),
  })
}
