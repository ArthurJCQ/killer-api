import { Expose } from 'class-transformer';

import { PlayerStatus } from '../constants';

export class PlayerListDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  status: PlayerStatus;

  @Expose()
  roomCode?: string;
}
