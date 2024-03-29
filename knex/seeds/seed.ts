import { Knex } from 'knex';

import { MISSION, MISSION_ROOM } from '../../src/modules/mission/constants';
import {
  PLAYER,
  PlayerRole,
  PlayerStatus,
} from '../../src/modules/player/constants';
import { ROOM, RoomStatus } from '../../src/modules/room/constants';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(MISSION_ROOM).del();
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
        roomCode: roomCodes[0].code,
        passcode: 1234,
        targetId: null,
        missionId: null,
      },
      {
        name: 'Sifredi',
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
        roomCode: roomCodes[1].code,
        passcode: 1234,
        targetId: null,
        missionId: null,
      },
    ])
    .returning('id');

  const missionIds = await knex(MISSION)
    .insert([
      {
        content: 'Push your friend in the stairs',
      },
      {
        content: 'Marry your best friend',
      },
    ])
    .returning('id');

  await knex(MISSION_ROOM).insert([
    {
      roomCode: roomCodes[0].code,
      missionId: missionIds[0].id,
      authorId: playerIds[0].id,
    },
    {
      roomCode: roomCodes[1].code,
      missionId: missionIds[1].id,
      authorId: playerIds[1].id,
    },
  ]);
}
