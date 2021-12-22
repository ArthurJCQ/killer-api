import { Expose } from 'class-transformer';

import { PlayerStatus } from '../constants';

export class PlayerDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  status: PlayerStatus;
  @Expose()
  roomId: number;
  @Expose()
  passcode?: number;
  @Expose()
  targetId?: number;
  @Expose()
  missionId?: number;
}
