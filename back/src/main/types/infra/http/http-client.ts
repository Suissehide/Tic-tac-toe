import type { BodyInit } from 'undici-types'

export type QueryParams = Record<string, string | number | boolean | Date>

export interface PostParams {
  url: string
  body?: BodyInit
  headers?: Record<string, string>
  queryParams?: QueryParams
}

export interface HandleResponseReturn<T> {
  data: T
  headers: Headers
}

export interface HttpClientInterface {
  buildUrlWithParams(url: string, queryParams?: Record<string, string>): string
  get: <T>(
    url: string,
    headers?: Record<string, string>,
    queryParams?: QueryParams,
    optionalData?: Record<string, string>,
  ) => Promise<HandleResponseReturn<T>>
  post: <T>({
    url,
    body,
    headers,
    queryParams,
  }: PostParams) => Promise<HandleResponseReturn<T>>
  delete<T>(
    url: string,
    headers?: Record<string, string>,
    queryParams?: QueryParams,
  ): Promise<HandleResponseReturn<T>>
}
