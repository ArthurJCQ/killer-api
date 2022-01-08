import { Expose } from 'class-transformer';

import { RoomStatus } from '../constants';

export class RoomDto {
  @Expose()
  code: string;
  @Expose()
  name: string;
  @Expose()
  status: RoomStatus;
}
