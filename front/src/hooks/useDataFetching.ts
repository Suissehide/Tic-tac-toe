import type { ApiError } from '../libs/httpErrorHandler.ts'
import { useLoaderStore } from '../store/useLoaderStore.ts'
import { useErrorNotification } from './useErrorNotification.ts'
import { useLoading } from './useLoading.ts'

interface UseDataFetchingParams {
  isPending: boolean
  isError: boolean
  error: Error | ApiError | null
  errorMessage?: string
}

export const useDataFetching = ({
  isPending,
  isError,
  error,
  errorMessage,
}: UseDataFetchingParams) => {
  const { setIsLoading } = useLoaderStore()
  useErrorNotification(isError, error, errorMessage)
  useLoading(isPending, setIsLoading)
}
