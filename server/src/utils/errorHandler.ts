export default class ErrorHanlder extends Error {
  status: number;
  constructor(status: number, message: any) {
    super(message);
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
