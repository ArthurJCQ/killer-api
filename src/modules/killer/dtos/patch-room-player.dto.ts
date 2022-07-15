import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PlayerRole } from '../constants';

export class PatchRoomPlayerDto {
  @ApiProperty()
  @IsOptional()
  roomCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: PlayerRole;
}
