import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { RoomStatus } from '../constants';

export class RoomDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ enum: RoomStatus })
  @Expose()
  status: RoomStatus;
}
