import type { TransformCallback } from 'stream'
import { Transform } from 'stream'

export class MockIncomingMessage extends Transform {
  public method: string
  public url: string
  public headers: any
  public rawHeaders: any
  public _writableState: any
  public _readableState: any
  public _failError: any
  constructor(options: {
    method?: string
    url?: string
    headers?: { [key: string]: string }
    rawHeaders?: unknown
    [key: string]: unknown
  }) {
    super()
    options = options || {}

    this._writableState.objectMode = true
    this._readableState.objectMode = false

    // Copy unreserved options
    const reservedOptions = ['method', 'url', 'headers', 'rawHeaders']

    Object.keys(options).forEach((key) => {
      if (reservedOptions.indexOf(key) === -1) (this as any)[key] = options[key]
    })

    this.method = options.method || 'GET'
    this.url = options.url || ''

    // Set header names
    this.headers = this.headers || {}
    this.rawHeaders = []

    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        const val = options?.headers?.[key]

        if (!val) {
          return
        }

        this.headers[key.toLowerCase()] = val
        this.rawHeaders.push(key)
        this.rawHeaders.push(val)
      })
    }

    // Auto-end when no body
    if (
      this.method === 'GET' ||
      this.method === 'HEAD' ||
      this.method === 'DELETE'
    ) {
      this.end()
    }
  }

  public _transform(
    chunk: string,
    _encoding: string,
    callback: TransformCallback
  ): void | boolean {
    if (this._failError) {
      return this.emit('error', this._failError)
    }

    if (!Buffer.isBuffer(chunk)) {
      chunk = JSON.stringify(chunk)
    }

    this.push(chunk)

    callback()
  }

  protected _fail(error: unknown) {
    this._failError = error
  }
}
