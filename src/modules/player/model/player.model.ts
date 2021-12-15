export enum PlayerStatus {
  ALIVE = 'ALIVE',
  KILLED = 'KILLED',
}

export interface PlayerModel {
  id: number;
  name: string;
  passcode: number;
  status: PlayerStatus;
  targetId?: number;
  missionId?: number;
}
