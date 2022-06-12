import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TargetDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}
