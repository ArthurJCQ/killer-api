import { PlayerStatus } from '../model/player.model';
import { Expose } from 'class-transformer';

export class PlayerDto {
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
