import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'
import { retry } from 'wretch/middlewares'

import type { ExportParams, ExportResponse } from '../types'

const BASE_URL = 'https://readwise.io/api/v2'

export const createReadwiseClient = (token: string) => {
  const api = wretch(BASE_URL)
    .addon(QueryStringAddon)
    .headers({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    })
    .middlewares([
      retry({
        delayTimer: 1000,
        delayRamp: (delay, attempts) => delay * 2 ** (attempts - 1),
        maxAttempts: 5,
        until: (response) => response != null && response.status !== 429,
        onRetry: async ({ response }) => {
          if (response?.status === 429) {
            const retryAfter = response.headers.get('Retry-After')
            if (retryAfter) {
              await new Promise((r) => setTimeout(r, Number(retryAfter) * 1000))
            }
          }
          return {}
        },
      }),
    ])

  return {
    validateToken: () =>
      api
        .url('/auth/')
        .get()
        .res()
        .then(() => undefined),

    exportHighlights: (params: ExportParams = {}): Promise<ExportResponse> => {
      const query: Record<string, string | boolean> = {}
      if (params.updatedAfter) query.updatedAfter = params.updatedAfter
      if (params.ids) query.ids = params.ids.join(',')
      if (params.includeDeleted !== undefined)
        query.includeDeleted = params.includeDeleted
      if (params.pageCursor) query.pageCursor = params.pageCursor

      return api.url('/export/').query(query).get().json<ExportResponse>()
    },

    exportAllHighlights: async (
      params: ExportParams = {},
    ): Promise<ExportResponse> => {
      const allResults: ExportResponse['results'] = []
      let cursor: string | null = null
      let totalCount = 0

      do {
        const query: Record<string, string | boolean> = {}
        if (params.updatedAfter) query.updatedAfter = params.updatedAfter
        if (params.ids) query.ids = params.ids.join(',')
        if (params.includeDeleted !== undefined)
          query.includeDeleted = params.includeDeleted
        if (cursor) query.pageCursor = cursor

        const page = await api
          .url('/export/')
          .query(query)
          .get()
          .json<ExportResponse>()

        allResults.push(...page.results)
        totalCount = page.count
        cursor = page.nextPageCursor
      } while (cursor)

      return { count: totalCount, nextPageCursor: null, results: allResults }
    },
  }
}

export type ReadwiseClient = ReturnType<typeof createReadwiseClient>
