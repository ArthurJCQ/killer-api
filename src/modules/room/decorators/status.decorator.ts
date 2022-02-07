import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { RoomStatus } from '../constants';

export const Status = (status: RoomStatus): CustomDecorator =>
  SetMetadata('roomStatus', status);
