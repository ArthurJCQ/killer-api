import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

import { Capitalize } from '../../../decorators/capitalize.decorator';
import { Trim } from '../../../decorators/trim.decorator';

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  @IsOptional()
  @Trim()
  @Capitalize()
  roomCode?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @Trim()
  name: string;
}
