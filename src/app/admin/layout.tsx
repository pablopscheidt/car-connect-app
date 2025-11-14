'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type AuthPayload = {
  sub: string
  email: string
  name?: string
}

/**
 * Decodifica o JWT só para pegar o nome/e-mail do usuário.
 * Não valida nada “de segurança”, isso o backend já faz.
 */
function decodeJwtPayload(token: string): AuthPayload | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as AuthPayload
  } catch {
    return null
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const [checking, setChecking] = React.useState(true)
  const [authorized, setAuthorized] = React.useState(false)
  const [userName, setUserName] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('access_token')

    if (!token) {
      setAuthorized(false)
      setChecking(false)
      router.replace('/login?redirect=' + encodeURIComponent(pathname))
      return
    }

    // pega nome do usuário do próprio token (se existir)
    const payload = decodeJwtPayload(token)
    const nameFromToken = payload?.name || payload?.email || null
    setUserName(nameFromToken)

    setAuthorized(true)
    setChecking(false)
  }, [router, pathname])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm text-sm text-gray-600">
          Verificando autenticação...
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  // menu principal do admin
  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/vehicles', label: 'Veículos' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/garage', label: 'Garagem' },
    // você pode ativar quando tiver pronto:
    // { href: '/admin/users', label: 'Usuários' },
  ]

  const isActive = (href: string) =>
    pathname === href ||
    (pathname.startsWith(href + '/') && pathname.endsWith('/'))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          {/* Marca + menu */}
          <div className="flex items-center gap-6 min-w-0">
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-lg font-semibold text-gray-900">
                Car Connect
              </span>
              <span className="text-xs uppercase tracking-wide text-violet-600">
                Admin
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'inline-flex items-center rounded-md px-3 py-1.5 transition-colors',
                    isActive(item.href)
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Infos do usuário */}
          <div className="flex items-center gap-3 text-sm">
            {userName && (
              <div className="hidden sm:flex items-center gap-2 text-gray-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[140px] truncate">{userName}</span>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="h-8 px-3 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className="mx-auto max-w-6xl px-4 pb-2 md:hidden">
          <nav className="flex flex-wrap gap-1 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'inline-flex items-center rounded-md px-2.5 py-1 transition-colors',
                  isActive(item.href)
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
