import { PlayerRole, PlayerStatus } from './constants';

export interface PlayerModel {
  id: number;
  name: string;
  status: PlayerStatus;
  role: PlayerRole;
  roomCode?: string;
  passcode?: string;
  targetId?: number;
  missionId?: number;
}
