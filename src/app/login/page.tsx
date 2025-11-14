'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
  )
  const redirect = searchParams.get('redirect') || '/admin'
  const { login, isLoggingIn, loginError } = useAuth(redirect)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [formError, setFormError] = React.useState<string | null>(null)

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!email || !password) {
      setFormError('Informe e-mail e senha.')
      return
    }

    try {
      await login({ email, password })
      // redirecionamento é feito no onSuccess do hook
    } catch (err) {
      console.error(err)
      setFormError('Credenciais inválidas ou erro ao realizar login.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-gray-100 p-6 space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Car Connect</h1>
          <p className="text-sm text-gray-500">Área do garagista</p>
        </header>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {(formError || loginError) && (
            <div className="text-sm text-red-600">
              {formError ??
                'Não foi possível realizar login. Verifique suas credenciais.'}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-10 rounded-md bg-violet-600 text-white font-medium hover:bg-violet-700 transition disabled:opacity-70"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Use as credenciais cadastradas no painel da garagem.
        </p>
      </div>
    </div>
  )
}
