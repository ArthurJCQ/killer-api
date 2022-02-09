import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PlayerStatus } from '../constants';

export class PlayerDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ enum: PlayerStatus })
  @Expose()
  status: PlayerStatus;

  @ApiProperty()
  @Expose()
  roomCode?: string;

  @ApiProperty()
  @Expose()
  targetId?: number;

  @ApiProperty()
  @Expose()
  missionId?: number;
}
