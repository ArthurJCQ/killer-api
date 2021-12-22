import { RoomStatus } from './constants';

export interface RoomModel {
  id: number;
  name: string;
  code: string;
  status: RoomStatus;
  createdAt: Date;
  dateEnd: Date;
}
