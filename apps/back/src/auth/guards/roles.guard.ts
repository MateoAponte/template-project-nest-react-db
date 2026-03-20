import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROL_KEY } from '../decorators/roles.decorator';
import { Rol } from 'src/user/enums/Rol';
import { IAuthRequest } from '../interfaces/AuthRequest.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Nos permite leer la meta-data

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request: IAuthRequest = context.switchToHttp().getRequest();
    const { user } = request;

    if (user.rol == undefined) return false;
    else return requiredRoles.some((rol) => user?.rol === rol);
  }
}
