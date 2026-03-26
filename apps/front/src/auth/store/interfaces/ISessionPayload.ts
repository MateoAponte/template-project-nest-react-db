import type { IUser } from './IUser';

export interface ISessionPayload {
  at_secret: string;
  rt_secret: string;
  user: IUser;
}
