import { apiClient } from './client'
import type { UserResponse } from './auth'

export interface CreateUserPayload {
  name: string
  email: string
  password: string
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>('/users', payload)
  return data
}
