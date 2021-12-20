import { PlayerRole, PlayerStatus } from './constants';

export interface PlayerModel {
  id: number;
  name: string;
  status: PlayerStatus;
  role: PlayerRole;
  roomId: number;
  passcode?: number;
  targetId?: number;
  missionId?: number;
}
