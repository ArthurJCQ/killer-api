import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

import { Trim } from '../../../decorators/trim.decorator';

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  @IsOptional()
  @Trim()
  roomCode?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @Trim()
  name: string;
}
