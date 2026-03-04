import { AuthApi } from './auth.api.ts'

let isRefreshing = false
let refreshPromise: Promise<Response> | null = null

export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const makeRequest = () =>
    fetch(input, {
      ...init,
      credentials: 'include',
    })

  let response = await makeRequest()

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = AuthApi.refresh()
    }

    try {
      const refreshResponse = await refreshPromise
      isRefreshing = false

      if (refreshResponse?.ok) {
        response = await makeRequest()
      } else {
        window.location.href = '/auth'
        return Promise.reject(new Error('Session expired'))
      }
    } catch {
      isRefreshing = false
      window.location.href = '/auth'
      return Promise.reject(new Error('Session expired'))
    }
  }

  return response
}
