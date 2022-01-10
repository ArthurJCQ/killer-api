import { Knex } from 'knex';

import { MISSION, PLAYER_MISSION } from '../../src/modules/mission/constants';
import {
  PLAYER,
  PlayerRole,
  PlayerStatus,
} from '../../src/modules/player/constants';
import { ROOM, RoomStatus } from '../../src/modules/room/constants';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(PLAYER_MISSION).del();
  await knex(MISSION).del();
  await knex(PLAYER).del();
  await knex(ROOM).del();

  // Inserts seed entries
  const roomCodes = await knex(ROOM)
    .insert([
      {
        name: 'Room 1',
        code: 'XNXX1',
        status: RoomStatus.PENDING,
        createdAt: '2022-12-25',
        dateEnd: '2022-01-25',
      },
      {
        name: 'Room 2',
        code: 'XHAM2',
        status: RoomStatus.IN_GAME,
        createdAt: '2022-12-25',
        dateEnd: '2022-01-25',
      },
      {
        name: 'Room 3',
        code: 'GANG3',
        status: RoomStatus.ENDED,
        createdAt: '2022-12-20',
        dateEnd: '2022-12-25',
      },
    ])
    .returning('code');

  const playerIds = await knex(PLAYER)
    .insert([
      {
        name: 'Roco',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.ADMIN,
        roomCode: roomCodes[0],
        passcode: 1234,
        targetId: null,
        missionId: null,
      },
      {
        name: 'Sifredi',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
        roomCode: roomCodes[1],
        passcode: 1234,
        targetId: null,
        missionId: null,
      },
    ])
    .returning('id');

  const missionIds = await knex(MISSION)
    .insert([
      {
        id: 1,
        content: 'Push your friend in the stairs',
      },
      {
        id: 2,
        content: 'Marry your best friend',
      },
    ])
    .returning('id');

  await knex(PLAYER_MISSION).insert([
    {
      playerId: playerIds[0],
      missionId: missionIds[0],
    },
    {
      playerId: playerIds[1],
      missionId: missionIds[1],
    },
  ]);
}
