import { RoomStatus } from './constants';

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