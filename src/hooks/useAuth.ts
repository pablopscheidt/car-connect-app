'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/lib/api'
import type { LoginResponse } from '@/types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export function useAuth(defaultRedirect = '/admin') {
  const router = useRouter()

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
      router.push(defaultRedirect)
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
