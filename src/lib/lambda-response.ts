import HttpStatusCodes from 'http-status-codes';

type Nullable<T> = T | null;

export const StatusCodes = HttpStatusCodes;
export class LambdaResponse {
  // @ts-ignore : using as a simple container, ignore
  private statusCode: number;

  // @ts-ignore : using as a simple container, ignore
  private body: any;

  constructor(statusCode: number, payload: Nullable<any> = null) {
    this.statusCode = statusCode;
    this.body = JSON.stringify({
      statusCode,
      payload,
      message: HttpStatusCodes.getStatusText(statusCode)
    });
  }
}
