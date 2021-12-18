import { Expose } from 'class-transformer';

import { PlayerStatus } from '../constants';

export class PlayerDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  passcode: number;
  @Expose()
  status: PlayerStatus;
  @Expose()
  targetId?: number;
  @Expose()
  missionId?: number;
}
