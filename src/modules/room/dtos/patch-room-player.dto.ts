import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PlayerRole } from '../../player/constants';

export class PatchRoomPlayerDto {
  @ApiProperty()
  @IsOptional()
  roomCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: PlayerRole;
}
