import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @Length(5)
  @IsOptional()
  roomCode?: string;

  @IsString()
  @MinLength(1)
  name: string;
}
