import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsString()
  @MinLength(1)
  name: string;
}
