import { Knex } from 'knex';

import {
  PLAYER,
  PlayerRole,
  PlayerStatus,
} from '../../src/modules/player/constants';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex(PLAYER).insert([
    {
      id: 1,
      name: 'Roco',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.ADMIN,
      roomId: 1,
      passcode: 1234,
      targetId: null,
      missionId: null,
    },
    {
      id: 2,
      name: 'Sifredi',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
      roomId: 1,
      passcode: 1234,
      targetId: null,
      missionId: null,
    },
  ]);
}
