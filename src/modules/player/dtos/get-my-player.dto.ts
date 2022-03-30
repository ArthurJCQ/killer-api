import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, MinLength } from 'class-validator';

import { Capitalize } from '../../../decorators/capitalize.decorator';
import { Trim } from '../../../decorators/trim.decorator';

export class GetMyPlayerDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @Trim()
  name: string;

  @ApiProperty()
  @IsNumberString()
  @Length(4)
  @Trim()
  passcode: string;

  @ApiProperty()
  @IsString()
  @Length(5)
  @Trim()
  @Capitalize()
  roomCode: string;
}
