export default class NovitaError {
  code: number = 0
  msg: string = ''
  taskStatus: number | undefined
  stack: string | undefined

  constructor(code: number, msg: string, taskStatus?: number) {
    this.msg = msg
    this.code = code
    this.taskStatus = taskStatus
    this.stack = new Error().stack
  }
}