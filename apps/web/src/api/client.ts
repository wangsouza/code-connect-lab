import axios, { AxiosError } from 'axios'
import { getToken } from './tokenStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  error?: string
}

/**
 * Normaliza um erro do axios no envelope de erro do NestJS
 * (`{ statusCode, message, error }`) numa mensagem amigável em português.
 */
export function extractApiError(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.',
): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>
    const data = axiosError.response?.data
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message
    }
    if (!axiosError.response) {
      return 'Não foi possível conectar ao servidor.'
    }
  }
  return fallback
}
