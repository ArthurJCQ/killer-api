import { Expose } from 'class-transformer';

import { RoomStatus } from '../constants';

export class RoomDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  code: string;
  @Expose()
  status: RoomStatus;
}
