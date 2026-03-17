import './ReadwiseContainer.css'

import { useRef, useState } from 'react'

import { createReadwiseClient } from '../api'
import { setupProps } from '../services/setup-properties'
import { buildBookIdToPageMap, syncBook } from '../services/sync-highlights'
import type {
  ExportedBook,
  ExportParams,
  ExportResponse,
  SyncStatus,
} from '../types'

export const ReadwiseContainer = () => {
  const cancelledRef = useRef(false)
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentBook, setCurrentBook] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [errors, setErrors] = useState<{ book: string; message: string }[]>([])

  const propsReady = !!logseq.settings?.propsConfigured

  const handleSetupProps = async () => {
    await setupProps()
  }

  const handleCancel = () => {
    cancelledRef.current = true
    setStatus('idle')
    setStatusMessage('Sync cancelled.')
    setCurrentBook('')
  }

  const handleSync = async () => {
    const token = logseq.settings?.apiToken as string
    if (!token) {
      setStatus('error')
      setStatusMessage('No API token configured. Set it in plugin settings.')
      return
    }

    cancelledRef.current = false
    setErrors([])
    setCurrent(0)
    setTotal(0)
    setCurrentBook('')
    setStatus('fetching')
    setStatusMessage('Fetching highlights from Readwise...')

    const client = createReadwiseClient(token)
    const allBooks: ExportedBook[] = []
    let cursor: string | null = null
    const updatedAfter =
      (logseq.settings?.lastSyncTimestamp as string) || undefined

    try {
      do {
        if (cancelledRef.current) return

        const params: ExportParams = {}
        if (updatedAfter) params.updatedAfter = updatedAfter
        if (cursor) params.pageCursor = cursor

        const page: ExportResponse = await client.exportHighlights(params)
        allBooks.push(...page.results)
        setTotal(allBooks.length)
        setStatusMessage(`Fetched ${allBooks.length} book(s) so far...`)
        cursor = page.nextPageCursor
      } while (cursor)

      if (allBooks.length === 0) {
        setStatus('completed')
        setStatusMessage('No new highlights to sync.')
        return
      }

      setStatus('syncing')
      setTotal(allBooks.length)

      const bookIdToPage = await buildBookIdToPageMap()

      for (let i = 0; i < allBooks.length; i++) {
        if (cancelledRef.current) return

        const book = allBooks[i]!
        setCurrent(i + 1)
        setCurrentBook(book.title)

        try {
          await syncBook(book, bookIdToPage)
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          setErrors((prev) => [...prev, { book: book.title, message: msg }])
        }
      }

      logseq.updateSettings({ lastSyncTimestamp: new Date().toISOString() })
      setStatus('completed')
      setStatusMessage(`Sync complete. ${allBooks.length} book(s) processed.`)
    } catch (err: unknown) {
      setStatus('error')
      setStatusMessage(
        `Sync failed: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  const progressPct = total > 0 ? Math.round((current / total) * 100) : 0
  const isBusy = status === 'fetching' || status === 'syncing'

  return (
    <div
      className="rw-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) logseq.hideMainUI()
      }}
    >
      <div className="rw-card">
        <div className="rw-header">
          <h2>Readwise Sync</h2>
          <span className={`rw-badge ${status}`}>{status}</span>
        </div>

        <div className="rw-body">
          {!propsReady && status === 'idle' && (
            <div className="rw-setup-notice">
              Properties must be set up before syncing. Click the button below
              to configure them.
            </div>
          )}

          <div className="rw-status">
            {statusMessage || 'Ready to sync your Readwise highlights.'}
          </div>

          {status !== 'idle' && (
            <>
              <div className="rw-current-book">
                {status === 'syncing' && currentBook}
                {status === 'fetching' && 'Fetching data from Readwise API...'}
              </div>
              <div className="rw-progress-track">
                <div
                  className={`rw-progress-bar ${status}`}
                  style={{
                    width: status === 'fetching' ? '100%' : `${progressPct}%`,
                    opacity: status === 'fetching' ? 0.4 : 1,
                  }}
                />
              </div>
              <div className="rw-progress-label">
                {status === 'fetching'
                  ? `${total} book(s) fetched`
                  : `${current} / ${total} (${progressPct}%)`}
              </div>
            </>
          )}

          {errors.length > 0 && (
            <div className="rw-errors">
              {errors.map((err, i) => (
                <div key={i} className="rw-error-item">
                  <strong>{err.book}</strong>
                  {err.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rw-actions">
          {!propsReady && status === 'idle' && (
            <button
              className="rw-btn rw-btn-primary"
              onClick={handleSetupProps}
            >
              Setup Properties
            </button>
          )}
          {propsReady && status === 'idle' && (
            <button className="rw-btn rw-btn-primary" onClick={handleSync}>
              Start Sync
            </button>
          )}
          {isBusy && (
            <button className="rw-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
          {propsReady && status === 'completed' && (
            <button className="rw-btn rw-btn-primary" onClick={handleSync}>
              Sync Again
            </button>
          )}
          {status === 'error' && (
            <button className="rw-btn rw-btn-primary" onClick={handleSync}>
              Retry
            </button>
          )}
          <button className="rw-btn" onClick={() => logseq.hideMainUI()}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
