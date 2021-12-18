import { IsNumber, IsOptional } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @IsOptional()
  roomId?: number;
}
