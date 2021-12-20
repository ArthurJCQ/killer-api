import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsString()
  name: string;
}
