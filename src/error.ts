export default class NovitaError {
  code: number = 0
  msg: string = ''
  taskStatus?: number
  stack?: string
  reason: string = ''
  metadata?: any

  constructor(code: number, msg: string, reason?: string, taskStatus?: number, metadata?: any) {
    this.msg = msg
    this.code = code
    this.taskStatus = taskStatus
    this.reason = reason || ''
    this.stack = new Error().stack
    this.metadata = metadata
  }
}