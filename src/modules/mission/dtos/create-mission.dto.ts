import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { Trim } from '../../../decorators/trim.decorator';

export class CreateMissionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'mission.BAD_CONTENT' })
  @Trim()
  content: string;
}
