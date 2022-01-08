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
  roomCode: string;
  @Expose()
  passcode?: number;
  @Expose()
  targetId?: number;
  @Expose()
  missionId?: number;
}
