import { PlayerRole, PlayerStatus } from './constants';

export interface PlayerModel {
  id: number;
  name: string;
  passcode: number;
  status: PlayerStatus;
  role: PlayerRole;
  roomId: number;
  targetId?: number;
  missionId?: number;
}
