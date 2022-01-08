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
      name: 'Roco',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.ADMIN,
      roomCode: 'XNXX',
      passcode: 1234,
      targetId: null,
      missionId: null,
    },
    {
      name: 'Sifredi',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
      roomCode: 'XHAM2',
      passcode: 1234,
      targetId: null,
      missionId: null,
    },
  ]);
}
