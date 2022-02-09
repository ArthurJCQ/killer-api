import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { PlayerStatus } from '../constants';

export class UpdatePlayerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumberString()
  @Length(4, 4)
  @IsOptional()
  passcode?: string;

  @ApiProperty({ enum: PlayerStatus })
  @IsOptional()
  @Equals(PlayerStatus.KILLED)
  status?: PlayerStatus.KILLED;
}
