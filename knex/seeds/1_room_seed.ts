import { Knex } from 'knex';

import { PLAYER } from '../../src/modules/player/constants';
import { ROOM, RoomStatus } from '../../src/modules/room/constants';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(PLAYER).del();
  await knex(ROOM).del();

  // Inserts seed entries
  await knex(ROOM).insert([
    {
      id: 1,
      name: 'Room 1',
      code: 'XNXX1',
      status: RoomStatus.PENDING,
      createdAt: '2022-12-25',
      dateEnd: '2022-01-25',
    },
    {
      id: 2,
      name: 'Room 2',
      code: 'XHAM2',
      status: RoomStatus.IN_GAME,
      createdAt: '2022-12-25',
      dateEnd: '2022-01-25',
    },
    {
      id: 3,
      name: 'Room 3',
      code: 'GANG3',
      status: RoomStatus.ENDED,
      createdAt: '2022-12-20',
      dateEnd: '2022-12-25',
    },
  ]);
}
