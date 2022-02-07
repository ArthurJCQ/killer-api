import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MissionDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  content: string;
}
