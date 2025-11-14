'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCreateVehicle } from '@/hooks/useSaveVehicle'
import type { AdminVehicleFormInput } from '@/types/admin-vehicles'
import { toast } from 'sonner'

const defaultForm: AdminVehicleFormInput = {
  brand: '',
  model: '',
  version: '',
  yearFabrication: new Date().getFullYear(),
  yearModel: new Date().getFullYear(),
  fuel: '',
  gearbox: '',
  color: '',
  priceOnRequest: false,
  price: null,
  status: 'IN_STOCK',
  description: '',
}

export default function NewVehiclePage() {
  const router = useRouter()
  const createMutation = useCreateVehicle()
  const [form, setForm] = React.useState<AdminVehicleFormInput>(defaultForm)
  const [formError, setFormError] = React.useState<string | null>(null)

  const set = <K extends keyof AdminVehicleFormInput>(
    key: K,
    value: AdminVehicleFormInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    setFormError(null)

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
      await createMutation.mutateAsync({
        ...form,
        version: form.version || null,
        color: form.color || null,
        description: form.description || null,
        price: form.priceOnRequest ? null : (form.price ?? null),
      })
      toast.success('Veículo criado com sucesso!')
      router.push('/admin/vehicles')
    } catch {
      setFormError('Não foi possível salvar o veículo.')
      toast.error('Erro ao salvar veículo.')
    }
  }

  const isSubmitting = createMutation.isPending

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo veículo</h1>
          <p className="text-sm text-gray-500">
            Preencha as informações básicas do veículo. As imagens serão
            adicionadas em uma etapa separada.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/vehicles')}
          className="h-9 px-4 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
      </header>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
      >
        {/* Linha 1: Identificação */}
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

        {/* Linha 2: Ano e características */}
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
                  Number(e.target.value) || new Date().getFullYear(),
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
                set(
                  'yearModel',
                  Number(e.target.value) || new Date().getFullYear(),
                )
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
              placeholder="Gasolina, Flex, Diesel..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Câmbio</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.gearbox}
              onChange={(e) => set('gearbox', e.target.value)}
              placeholder="Manual, Automático..."
            />
          </div>
        </div>

        {/* Linha 3: Cor, status, preço */}
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

        {/* Descrição */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Descrição</label>
          <textarea
            className="min-h-[120px] w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-violet-500"
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value || null)}
            placeholder="Detalhes adicionais sobre o veículo, histórico, opcionais, etc."
          />
        </div>

        {/* Erro */}
        {(formError || createMutation.error) && (
          <div className="text-sm text-red-600">
            {formError ?? 'Erro ao salvar o veículo.'}
          </div>
        )}

        {/* Ações */}
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
            {isSubmitting ? 'Salvando...' : 'Salvar veículo'}
          </button>
        </div>
      </form>
    </div>
  )
}
