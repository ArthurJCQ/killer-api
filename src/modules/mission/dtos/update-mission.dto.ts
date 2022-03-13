import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { Trim } from '../../../decorators/trim.decorator';

export class UpdateMissionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @Trim()
  content: string;
}
