import { Transform } from 'stream'
import util from 'util'

export function MockIncomingMessage(options) {
  options = options || {}

  Transform.call(this)
  this._writableState.objectMode = true
  this._readableState.objectMode = false

  // Copy unreserved options
  const reservedOptions = ['method', 'url', 'headers', 'rawHeaders']

  Object.keys(options).forEach(function (key) {
    if (reservedOptions.indexOf(key) === -1) this[key] = options[key]
  })

  this.method = options.method || 'GET'
  this.url = options.url || ''

  // Set header names
  this.headers = {}
  this.rawHeaders = []
  if (options.headers) {
    Object.keys(options.headers).forEach(function (key) {
      let val = options.headers[key]

      if (val !== undefined) {
        if (typeof val !== 'string') {
          val = `${val}`
        }

        this.headers[key.toLowerCase()] = val
        this.rawHeaders.push(key)
        this.rawHeaders.push(val)
      }
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

util.inherits(MockIncomingMessage, Transform)

MockIncomingMessage.prototype._transform = function (chunk, encoding, next) {
  if (this._failError) return this.emit('error', this._failError)

  if (typeof chunk !== 'string' && !Buffer.isBuffer(chunk)) {
    chunk = JSON.stringify(chunk)
  }

  this.push(chunk)

  next()
}

// Causes the request to emit an error when the body is read.
MockIncomingMessage.prototype._fail = function (error) {
  this._failError = error
}
