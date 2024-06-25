/** @format */

import axios from "axios";
import { ResponseCodeV3 } from "./types";

export class NovitaError {
  code: number = 0;
  msg: string = "";
  stack?: string;
  reason: string = "";
  metadata?: any;
  error?: Error;

  constructor(code: number, msg: string, reason?: string, metadata?: any, error?: Error) {
    this.msg = msg;
    this.code = code;
    this.reason = reason || "";
    this.stack = new Error().stack;
    this.metadata = metadata;
    this.error = error;
    if (error instanceof axios.CanceledError) {
      this.code = ResponseCodeV3.CANCELED;
      this.msg = "Task canceled";
    }
  }

  get isCanceled() {
    return this.error instanceof axios.CanceledError;
  }
}
