'use client'
import React from 'react'
import { apiPublic } from '@/lib/api'
import { toast } from 'sonner'

export type InterestModalProps = {
  open: boolean
  onClose: () => void
  vehicleTitle: string
  garageSlug: string
  vehicleId?: string
}

export default function InterestModal({
  open,
  onClose,
  vehicleTitle,
  garageSlug,
  vehicleId,
}: InterestModalProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState(
    `Olá! Tenho interesse no ${vehicleTitle}.`,
  )
  const [consent, setConsent] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)

  if (!open) return null

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault()

    if (!email && !phone) {
      toast.error('Informe ao menos um contato: e-mail ou telefone.')
      return
    }

    if (!consent) {
      toast.error('Você precisa concordar com o tratamento de dados (LGPD).')
      return
    }

    try {
      setSubmitting(true)

      await apiPublic.post(`/v1/public/${garageSlug}/leads`, {
        vehicleId,
        name,
        email: email || undefined,
        phone: phone || undefined,
        message: message || undefined,
        consentLgpd: consent,
      })

      toast.success(
        'Interesse enviado com sucesso! Em breve a garagem entrará em contato.',
      )
      onClose()
      setName('')
      setEmail('')
      setPhone('')
      setMessage(`Olá! Tenho interesse no ${vehicleTitle}.`)
      setConsent(true)
    } catch (err) {
      console.error(err)
      toast.error(
        'Não foi possível enviar seu interesse. Tente novamente em alguns instantes.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b px-5 py-3">
          <h3 className="text-lg font-semibold">Tenho interesse</h3>
        </div>

        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome</label>
            <input
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Telefone/WhatsApp
              </label>
              <input
                className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mensagem</label>
            <textarea
              className="min-h-[96px] w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mt-1"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              Concordo com o tratamento dos meus dados pessoais para contato
              sobre este veículo, conforme a LGPD.
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar interesse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
