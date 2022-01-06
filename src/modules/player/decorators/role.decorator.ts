import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { PlayerRole } from '../constants';

export const Role = (role: PlayerRole): CustomDecorator =>
  SetMetadata('role', role);
