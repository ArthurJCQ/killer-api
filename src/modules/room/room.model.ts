import { RoomStatus } from './constants';

export interface RoomModel {
  code: string;
  name: string;
  status: RoomStatus;
  createdAt: Date;
  dateEnd: Date;
}
