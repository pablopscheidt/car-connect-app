'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { LoginResponse } from '@/types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export function useAuth() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const { data } = await apiAuth.post<LoginResponse>('/v1/auth/login', {
        email,
        password,
      })
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
      }
      return data
    },
    onSuccess: () => {
      const redirect = searchParams.get('redirect') || '/admin'
      router.push(redirect)
    },
  })

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
    router.push('/login')
  }

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as Error | null,
    logout,
  }
}
