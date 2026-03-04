import { TextDecoder } from 'node:util'
import Boom from '@hapi/boom'
import { detect } from 'chardet'
import type { IocContainer } from '../../types/application/ioc'
import type {
  HandleResponseReturn,
  HttpClientInterface,
  PostParams,
  QueryParams,
} from '../../types/infra/http/http-client'
import type { Logger } from '../../types/utils/logger'

class HttpClient implements HttpClientInterface {
  private readonly logger: Logger

  constructor({ logger }: IocContainer) {
    this.logger = logger
  }

  buildUrlWithParams(url: string, queryParams?: QueryParams): string {
    if (!queryParams) {
      return url
    }
    const urlObj = new URL(url)
    for (const key of Object.keys(queryParams)) {
      urlObj.searchParams.append(key, `${queryParams[key]}`)
    }
    return urlObj.toString()
  }

  async extractResponseData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type')
    const isJsonResponse = contentType?.includes('application/json') ?? false
    let formatedResponse: T
    const responseClone = response.clone()
    if (isJsonResponse) {
      try {
        const buffer = await response.arrayBuffer()
        const encoding = detect(Buffer.from(buffer)) ?? undefined
        const responseText = new TextDecoder(encoding).decode(buffer)
        formatedResponse = JSON.parse(responseText) as T
      } catch {
        formatedResponse = (await responseClone.arrayBuffer()) as T
      }
    } else {
      formatedResponse = (await response.text()) as T
    }
    this.logger.debug(JSON.stringify(formatedResponse))
    return formatedResponse
  }

  async handleResponse<T>(
    response: Response,
  ): Promise<HandleResponseReturn<T>> {
    const data = await this.extractResponseData<T>(response)
    if (response.ok) {
      return { data, headers: response.headers }
    }
    const { status: statusCode, statusText } = response
    const errorMessage = `HTTP Error: ${statusCode} ${statusText}`
    this.logger.debug(errorMessage)
    throw new Boom.Boom(errorMessage, { statusCode, data })
  }

  async get<T>(
    url: string,
    headers?: Record<string, string>,
    queryParams?: QueryParams,
    optionalData?: Record<string, string>,
  ): Promise<HandleResponseReturn<T>> {
    let response: Response | undefined
    try {
      let urlWithParams = url
      if (queryParams) {
        urlWithParams = this.buildUrlWithParams(url, queryParams)
      }
      this.logger.trace(`GET: ${urlWithParams}`)
      response = await fetch(urlWithParams, {
        method: 'GET',
        headers,
        ...optionalData,
      })
    } catch (error) {
      const { message } = error as Error
      this.logger.debug(message)
      throw Boom.serverUnavailable('Error getting data')
    }
    return this.handleResponse(response)
  }

  async post<T>({
    url,
    queryParams,
    body,
    headers,
  }: PostParams): Promise<HandleResponseReturn<T>> {
    let response: Response | undefined
    try {
      let urlWithParams = url
      if (queryParams) {
        urlWithParams = this.buildUrlWithParams(url, queryParams)
      }
      this.logger.trace(
        `POST: ${urlWithParams}, body: ${JSON.stringify(body, null, 2)}`,
      )
      response = await fetch(urlWithParams, {
        method: 'POST',
        headers,
        body,
      })
    } catch (error) {
      const { message } = error as Error
      this.logger.debug(message)
      throw Boom.serverUnavailable('Error posting data')
    }
    return this.handleResponse(response)
  }

  async delete<T>(
    url: string,
    headers?: Record<string, string>,
    queryParams?: QueryParams,
  ): Promise<HandleResponseReturn<T>> {
    let response: Response | undefined
    try {
      let urlWithParams = url
      if (queryParams) {
        urlWithParams = this.buildUrlWithParams(url, queryParams)
      }
      this.logger.trace(`DELETE: ${urlWithParams}`)
      response = await fetch(urlWithParams, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })
    } catch (error) {
      const { message } = error as Error
      this.logger.debug(message)
      throw Boom.serverUnavailable('Error delete resource')
    }
    return this.handleResponse(response)
  }
}

export { HttpClient }
