import axios from 'axios'

export class NovitaError {
  code: number = 0
  msg: string = ''
  stack?: string
  reason: string = ''
  metadata?: any
  error?: Error

  constructor(code: number, msg: string, reason?: string, metadata?: any, error?: Error) {
    this.msg = msg
    this.code = code
    this.reason = reason || ''
    this.stack = new Error().stack
    this.metadata = metadata
    this.error = error
  }

  get isCanceled() {
    return this.error instanceof axios.CanceledError
  }
}
