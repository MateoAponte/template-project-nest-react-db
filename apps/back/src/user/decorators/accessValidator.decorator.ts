import { applyDecorators } from '@nestjs/common';
import { Activity, Rol } from '../enums';
import { Activities, Roles } from 'src/auth/decorators';

type AccessValidatorOptions = {
  rol?: Rol;
  activities?: Activity[];
};

export const AccessValidator = ({
  rol = Rol.USER,
  activities = [],
}: AccessValidatorOptions = {}): MethodDecorator =>
  applyDecorators(
    Roles(Rol.ADMIN, rol),
    Activities(Activity.ADMIN, ...activities),
  );
