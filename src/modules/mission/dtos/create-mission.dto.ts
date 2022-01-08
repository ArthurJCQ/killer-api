import { IsString, MinLength } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  @MinLength(2)
  content: string;
}
