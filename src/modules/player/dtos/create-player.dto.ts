import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  @Length(5)
  @IsOptional()
  roomCode?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
}
