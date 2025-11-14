import axios from 'axios'
import { toast } from 'sonner'

export const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
})

export const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
})

apiAuth.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiAuth.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.message ?? 'Erro de rede ou servidor.'
    if (err?.response?.status !== 401) {
      toast.error(Array.isArray(msg) ? msg[0] : String(msg))
    }
    return Promise.reject(err)
  },
)
