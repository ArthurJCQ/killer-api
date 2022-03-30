import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { Capitalize } from '../../../decorators/capitalize.decorator';
import { Trim } from '../../../decorators/trim.decorator';
import { PlayerStatus } from '../constants';

export class UpdatePlayerDto {
  @ApiProperty()
  @IsString()
  @Length(1)
  @IsOptional()
  @Trim()
  name?: string;

  @ApiProperty()
  @IsNumberString()
  @Length(4, 4)
  @IsOptional()
  @Trim()
  passcode?: string;

  @ApiProperty()
  @IsString()
  @Length(5, 5)
  @IsOptional()
  @Trim()
  @Capitalize()
  roomCode?: string;

  @ApiProperty({ enum: PlayerStatus })
  @IsOptional()
  @Equals(PlayerStatus.KILLED)
  status?: PlayerStatus.KILLED;
}
