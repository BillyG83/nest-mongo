import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/authType.enum';
import { AUTH_TYPE_KEY } from '../const/auth.const';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
