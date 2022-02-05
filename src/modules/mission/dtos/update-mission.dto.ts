import { IsString, MinLength } from 'class-validator';

export class UpdateMissionDto {
  @IsString()
  @MinLength(2)
  content: string;
}
