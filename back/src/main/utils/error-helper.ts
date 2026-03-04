export const ignoreRejection = async <T>(
  p: Promise<T>,
  debugLogger?: { debug: (message: string) => void },
): Promise<T | undefined> => {
  let result: T | undefined
  try {
    result = await p
  } catch (error) {
    debugLogger?.debug(String(error))
  }
  return result
}
