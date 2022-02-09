import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  content: string;
}
