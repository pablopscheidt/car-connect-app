'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAdminVehicle } from '@/hooks/useAdminVehicle'
import { useUpdateVehicle } from '@/hooks/useUpdateVehicle'
import type { AdminVehicleFormInput } from '@/types/admin-vehicles'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/Skeleton'

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data, isLoading, isError } = useAdminVehicle(id)
  const updateMutation = useUpdateVehicle(id)
  const [form, setForm] = React.useState<AdminVehicleFormInput | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (data && !form) {
      setForm({
        brand: data.brand,
        model: data.model,
        version: data.version ?? '',
        yearFabrication: data.yearFabrication,
        yearModel: data.yearModel,
        fuel: data.fuel,
        gearbox: data.gearbox,
        color: data.color ?? '',
        priceOnRequest: data.priceOnRequest,
        price: data.price ?? null,
        status: data.status,
        description: data.description ?? '',
      })
    }
  }, [data, form])

  const set = <K extends keyof AdminVehicleFormInput>(
    key: K,
    value: AdminVehicleFormInput[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    setFormError(null)
    if (!form) return

    if (!form.brand || !form.model) {
      setFormError('Marca e modelo são obrigatórios.')
      return
    }

    if (
      !form.priceOnRequest &&
      (form.price === null || form.price === undefined)
    ) {
      setFormError('Informe o preço ou marque como "Sob consulta".')
      return
    }

    try {
      await updateMutation.mutateAsync({
        ...form,
        version: form.version || null,
        color: form.color || null,
        description: form.description || null,
        price: form.priceOnRequest ? null : (form.price ?? null),
      })
      toast.success('Veículo atualizado!')
      router.push('/admin/vehicles')
    } catch {
      setFormError('Não foi possível atualizar o veículo.')
      toast.error('Erro ao atualizar.')
    }
  }

  const isSubmitting = updateMutation.isPending

  if (isLoading || !form) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-600">
        Não foi possível carregar o veículo para edição.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar veículo</h1>
          <p className="text-sm text-gray-500">
            Atualize as informações do veículo. As imagens são gerenciadas em
            outra seção.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/vehicles')}
          className="h-9 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
        >
          Voltar
        </button>
      </header>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
      >
        {/* Mesma estrutura do formulário de criação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Marca</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Modelo</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.model}
              onChange={(e) => set('model', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Versão</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.version ?? ''}
              onChange={(e) => set('version', e.target.value || null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ano fabricação
            </label>
            <input
              type="number"
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.yearFabrication}
              onChange={(e) =>
                set(
                  'yearFabrication',
                  Number(e.target.value) || form.yearFabrication,
                )
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ano modelo
            </label>
            <input
              type="number"
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.yearModel}
              onChange={(e) =>
                set('yearModel', Number(e.target.value) || form.yearModel)
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Combustível
            </label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.fuel}
              onChange={(e) => set('fuel', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Câmbio</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.gearbox}
              onChange={(e) => set('gearbox', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cor</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.color ?? ''}
              onChange={(e) => set('color', e.target.value || null)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              <option value="IN_STOCK">Em estoque</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Preço</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                disabled={form.priceOnRequest}
                className="h-10 flex-1 rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                value={form.price ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  set('price', value ? Number(value) : null)
                }}
                placeholder="Ex.: 45000"
              />
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={form.priceOnRequest}
                  onChange={(e) => set('priceOnRequest', e.target.checked)}
                />
                Sob consulta
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Descrição</label>
          <textarea
            className="min-h-[120px] w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-violet-500"
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value || null)}
          />
        </div>

        {(formError || updateMutation.error) && (
          <div className="text-sm text-red-600">
            {formError ?? 'Erro ao atualizar o veículo.'}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/vehicles')}
            className="h-10 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-10 px-4 rounded-md bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
