'use client'

import React from 'react'
import {
  useGarageProfile,
  useUpdateGarageProfile,
} from '@/hooks/useGarageProfile'
import type { AdminGarageProfile } from '@/types/admin-garage'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from 'sonner'

export default function GarageProfilePage() {
  const { data, isLoading, isError } = useGarageProfile()
  const updateMutation = useUpdateGarageProfile()
  const [form, setForm] = React.useState<AdminGarageProfile | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (data && !form) {
      setForm({
        name: data.name,
        // slug: data.slug,
        city: data.city ?? '',
        state: data.state ?? '',
        phoneWhatsapp: data.phoneWhatsapp ?? '',
        instagram: data.instagram ?? '',
        facebook: data.facebook ?? '',
        website: data.website ?? '',
        themePrimaryColor: data.themePrimaryColor ?? '#6C2BD9',
      })
    }
  }, [data, form])

  const set = <K extends keyof AdminGarageProfile>(
    key: K,
    value: AdminGarageProfile[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    setFormError(null)
    if (!form) return

    if (!form.name) {
      setFormError('O nome da garagem é obrigatório.')
      return
    }

    try {
      await updateMutation.mutateAsync({
        ...form,
        city: form.city || null,
        state: form.state || null,
        phoneWhatsapp: form.phoneWhatsapp || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        website: form.website || null,
        themePrimaryColor: form.themePrimaryColor || null,
      })
      // aqui poderia ter um toast de sucesso
      toast.success('Dados da garagem atualizados com sucesso.')
    } catch {
      toast.error('Não foi possível salvar os dados da garagem.')
      setFormError('Não foi possível salvar os dados da garagem.')
    }
  }

  const isSubmitting = updateMutation.isPending

  if (isLoading || !form) {
    return (
      <div className="p-6">
        <div className="mb-4 flex gap-3">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-600">
        Não foi possível carregar os dados da garagem.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Perfil da garagem
          </h1>
          <p className="text-sm text-gray-500">
            Essas informações são exibidas no site público da sua garagem.
          </p>
        </div>
      </header>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Nome</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          {/* <div>
            <label className="block text-sm text-gray-600 mb-1">Slug</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
              value={form.slug}
              disabled
            />
            <p className="mt-1 text-xs text-gray-400">
              Usado na URL pública da garagem (ex.: /{form.slug}).
            </p>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cidade</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.city ?? ''}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.state ?? ''}
              onChange={(e) => set('state', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">WhatsApp</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.phoneWhatsapp ?? ''}
              onChange={(e) => set('phoneWhatsapp', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Instagram
            </label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.instagram ?? ''}
              onChange={(e) => set('instagram', e.target.value)}
              placeholder="https://instagram.com/sua-garagem"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Facebook</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.facebook ?? ''}
              onChange={(e) => set('facebook', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Site</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.website ?? ''}
              onChange={(e) => set('website', e.target.value)}
              placeholder="https://www.sua-garagem.com.br"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Cor primária (tema)
            </label>
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={form.themePrimaryColor ?? ''}
              onChange={(e) => set('themePrimaryColor', e.target.value)}
              placeholder="#6C2BD9"
            />
            <p className="mt-1 text-xs text-gray-400">
              Use um valor em HEX (ex.: #6C2BD9).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">
              Pré-visualização da cor:
            </div>
            <div
              className="h-8 w-8 rounded-full border border-gray-200"
              style={{ backgroundColor: form.themePrimaryColor || '#6C2BD9' }}
            />
          </div>
        </div>

        {(formError || updateMutation.error) && (
          <div className="text-sm text-red-600">
            {formError ?? 'Erro ao salvar os dados da garagem.'}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
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
