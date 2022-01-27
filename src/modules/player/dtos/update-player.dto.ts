import {
  Equals,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { PlayerStatus } from '../constants';

export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumberString()
  @Length(4, 4)
  @IsOptional()
  passcode?: string;

  @IsOptional()
  @Equals(PlayerStatus.KILLED)
  status?: PlayerStatus.KILLED;
}
