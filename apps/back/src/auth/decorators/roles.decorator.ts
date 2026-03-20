import { SetMetadata } from '@nestjs/common';

export const ROL_KEY = 'rol';
export const Roles = (...args: string[]): MethodDecorator =>
  SetMetadata(ROL_KEY, args);
