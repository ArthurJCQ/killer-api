import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PatchRoomPlayerDto {
  @ApiProperty()
  @IsOptional()
  roomCode: string;
}
