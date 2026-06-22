const TOKEN_KEY = 'codeconnect:token'

/**
 * Persiste o token JWT. Quando `remember` é verdadeiro, usa localStorage
 * (sobrevive ao fechamento da aba); caso contrário, sessionStorage.
 */
export function setToken(token: string, remember: boolean): void {
  clearToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

/** Lê o token, priorizando a sessão atual e depois o armazenamento persistente. */
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
}

/** Remove o token de ambos os armazenamentos. */
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
}
