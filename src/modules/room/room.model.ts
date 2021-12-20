import { RoomStatus } from './constants';

export interface RoomModel {
  id: number;
  name: string;
  code: string;
  nbPlayer: number;
  status: RoomStatus;
  createdAt: Date;
  dateEnd: Date;
}
