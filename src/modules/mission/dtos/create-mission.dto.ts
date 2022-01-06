import { IsString } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  content: string;
}
