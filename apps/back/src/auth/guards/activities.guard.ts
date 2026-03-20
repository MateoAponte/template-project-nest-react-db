import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ACTIVITY_KEY } from '../decorators/activities.decorator';
import { IAuthRequest } from '../interfaces/AuthRequest.interface';
import { Activities } from 'src/user/enums/Activities';

@Injectable()
export class ActivitiesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Nos permite leer la meta-data

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredActivities = this.reflector.getAllAndOverride<Activities[]>(
      ACTIVITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredActivities) return true;

    const request: IAuthRequest = context.switchToHttp().getRequest();
    const { user } = request;

    if (user.activities == undefined) return false;
    else
      return requiredActivities.some(
        (activity) =>
          (user?.activities ?? []).findIndex(
            (userActivity) => userActivity === activity,
          ) > -1,
      );
  }
}
