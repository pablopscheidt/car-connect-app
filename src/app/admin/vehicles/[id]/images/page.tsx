// src/app/admin/vehicles/[id]/images/page.tsx
'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  useVehicleImages,
  useUploadVehicleImages,
  useSetCoverImage,
  useDeleteVehicleImage,
  useReorderVehicleImages,
} from '@/hooks/useVehicleImages'
import type { VehicleImage } from '@/types/admin-vehicle-images'
import { toast } from 'sonner'

// dnd-kit
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Skeleton } from '@/components/ui/Skeleton'
import Image from 'next/image'

function reorder<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items
  return arrayMove(items, fromIndex, toIndex)
}

type CardProps = {
  img: VehicleImage
  index: number
  pending: boolean
  onSetCover: (id: string) => void
  onDelete: (id: string) => void
}

// Item “sortável” com dnd-kit
function SortableImageCard({
  img,
  index,
  pending,
  onSetCover,
  onDelete,
}: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: img.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.15)' : undefined,
    opacity: isDragging ? 0.95 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm select-none"
    >
      <div
        // área de drag
        {...attributes}
        {...listeners}
        className="relative aspect-[4/3] bg-gray-100 cursor-grab active:cursor-grabbing"
        title="Arraste para reordenar"
      >
        <Image
          src={'http://localhost:4000' + img.url}
          alt=""
          className="h-full w-full object-cover"
          width={400}
          height={300}
          loading="lazy"
        />
        {img.isCover && (
          <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
            CAPA
          </span>
        )}
        <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[10px] text-gray-700 border border-gray-200">
          #{index + 1}
        </span>
      </div>

      <div className="p-3 flex items-center justify-between text-xs text-gray-600">
        <button
          type="button"
          onClick={() => onSetCover(img.id)}
          className="h-7 rounded-md border border-gray-300 px-2 hover:bg-gray-50 disabled:opacity-50"
          disabled={img.isCover || pending}
        >
          Definir capa
        </button>
        <button
          type="button"
          onClick={() => onDelete(img.id)}
          className="h-7 rounded-md border border-red-300 text-red-600 px-2 hover:bg-red-50 disabled:opacity-50"
          disabled={pending}
        >
          Excluir
        </button>
      </div>
    </li>
  )
}

export default function VehicleImagesPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { data, isLoading, isError } = useVehicleImages(id)
  const uploadMutation = useUploadVehicleImages(id)
  const setCoverMutation = useSetCoverImage(id)
  const deleteMutation = useDeleteVehicleImage(id)
  const reorderMutation = useReorderVehicleImages(id)

  const [draft, setDraft] = React.useState<VehicleImage[] | null>(null)
  const [pending, setPending] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  // sensores do dnd-kit (mouse/touch/keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  React.useEffect(() => {
    if (data && !draft) {
      const sorted = [...data].sort((a, b) => a.position - b.position)
      console.log('setting draft', sorted)
      setDraft(sorted)
    }
    console.log('data changed', data, draft)
  }, [data, draft])

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    setErr(null)
    const input = e.currentTarget
    const files = Array.from(input.files || [])
    if (files.length === 0) return

    const hasExisting = Boolean(draft && draft.length > 0)

    try {
      setPending(true)
      await uploadMutation.mutateAsync({
        files,
        setFirstAsCoverIfEmpty: true,
        hasExisting,
      })
      toast.success(`Enviadas ${files.length} imagem(ns).`)
      setDraft(null) // recarrega do servidor
      input.value = ''
    } catch (err) {
      console.error(err)
      setErr('Falha ao enviar imagens.')
      toast.error('Falha no upload.')
    } finally {
      setPending(false)
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    if (!draft) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = draft.findIndex((i) => i.id === String(active.id))
    const newIndex = draft.findIndex((i) => i.id === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    setDraft(reorder(draft, oldIndex, newIndex))
  }

  const saveOrder = async () => {
    if (!draft) return
    try {
      setPending(true)
      await reorderMutation.mutateAsync(draft.map((i) => i.id))
      toast.success('Ordem salva!')
      setDraft(null) // recarrega do servidor
    } catch {
      setErr('Não foi possível salvar a ordem.')
      toast.error('Erro ao salvar ordem.')
    } finally {
      setPending(false)
    }
  }

  const setCover = async (imageId: string) => {
    try {
      setPending(true)
      await setCoverMutation.mutateAsync(imageId)
      toast.success('Capa definida!')
      setDraft(null)
    } catch {
      setErr('Não foi possível definir capa.')
      toast.error('Erro ao definir capa.')
    } finally {
      setPending(false)
    }
  }

  const removeImage = async (imageId: string) => {
    if (!confirm('Remover esta imagem?')) return
    try {
      setPending(true)
      await deleteMutation.mutateAsync(imageId)
      toast.success('Imagem removida.')
      setDraft((prev) => prev?.filter((i) => i.id !== imageId) ?? null)
    } catch {
      setErr('Não foi possível remover a imagem.')
      toast.error('Erro ao remover.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Imagens do veículo
          </h1>
          <p className="text-sm text-gray-500">
            Arraste para reordenar. Envie, defina capa e exclua quando
            necessário.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/admin/vehicles`)}
          className="h-9 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
        >
          Voltar
        </button>
      </header>

      {/* Upload */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <label className="block text-sm text-gray-600 mb-2">
          Enviar imagens (múltiplas)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileChange}
          disabled={pending}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-sm file:hover:bg-gray-50"
        />
        <p className="mt-2 text-xs text-gray-400">
          Dica: segure e arraste as imagens para mudar a ordem. A primeira
          posição costuma ser usada como capa na listagem pública.
        </p>
      </section>

      {/* Lista / grid com DnD */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        {(isLoading || !draft) && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 overflow-hidden"
              >
                <Skeleton className="aspect-[4/3]" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 rounded" />
                  <Skeleton className="h-7 rounded" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {isError && (
          <div className="py-8 text-center text-red-600">
            Não foi possível carregar as imagens.
          </div>
        )}

        {draft && draft.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            Nenhuma imagem enviada ainda.
          </div>
        )}

        {draft && draft.length > 0 && (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={draft.map((d) => d.id)}
                strategy={rectSortingStrategy}
              >
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {draft.map((img, idx) => (
                    <SortableImageCard
                      key={img.id}
                      img={img}
                      index={idx}
                      pending={pending}
                      onSetCover={setCover}
                      onDelete={removeImage}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={saveOrder}
                className="h-9 px-4 rounded-md bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-70"
                disabled={pending}
              >
                Salvar ordem
              </button>
            </div>
          </>
        )}

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </section>
    </div>
  )
}
