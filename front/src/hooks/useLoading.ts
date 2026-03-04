import { useEffect, useRef } from 'react'

export const useLoading = (
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
) => {
  const previousLoadingRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (previousLoadingRef.current !== isLoading) {
      setIsLoading(isLoading)
      previousLoadingRef.current = isLoading
    }

    return () => {
      if (isLoading) {
        setIsLoading(false)
      }
    }
  }, [isLoading, setIsLoading])
}
