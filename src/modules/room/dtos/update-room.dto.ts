import { IsDate, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

import { RoomStatus } from '../constants';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsIn([RoomStatus.IN_GAME, RoomStatus.ENDED])
  status?: RoomStatus.IN_GAME | RoomStatus.ENDED;

  @IsOptional()
  @IsDate()
  dateEnd?: Date;
}
