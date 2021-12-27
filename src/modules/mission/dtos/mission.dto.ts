import { Expose } from 'class-transformer';

export class MissionDto {
  @Expose()
  id: number;
  @Expose()
  content: string;
}
