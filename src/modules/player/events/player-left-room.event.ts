import { PlayerModel } from '../player.model';

export class PlayerLeftRoomEvent {
  constructor(public readonly player: PlayerModel) {}
}
