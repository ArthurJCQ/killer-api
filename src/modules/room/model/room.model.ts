export enum RoomStatus {
  PENDING = 'PENDING',
  IN_GAME = 'IN_GAME',
}

export interface RoomModel {
  id: number;
  name: string;
  code: string;
  nbPlayer: number;
  ownerId: number;
  status: RoomStatus;
  createdAt: Date;
  duration: Date;
}
