export enum PlayerStatus {
  ALIVE = 'ALIVE',
  KILLED = 'KILLED',
}

export enum PlayerRole {
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN',
}

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
