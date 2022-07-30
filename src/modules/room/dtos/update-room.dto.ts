import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

import { Trim } from '../../../decorators/trim.decorator';
import { RoomStatus } from '../constants';

export class UpdateRoomDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'player.BAD_NAME' })
  @Trim()
  name?: string;

  @ApiProperty({ enum: RoomStatus })
  @IsOptional()
  @IsIn([RoomStatus.IN_GAME, RoomStatus.ENDED])
  status?: RoomStatus.IN_GAME | RoomStatus.ENDED;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  dateEnd?: Date;
}
