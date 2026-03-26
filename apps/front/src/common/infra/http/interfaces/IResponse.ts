import type { HttpStatusCode } from 'axios';

export interface IResponse<T> {
  data: T;
  message: string;
  statusCode: HttpStatusCode;
}
