import { Knex } from 'knex';

import { MISSION, PLAYER_MISSION } from '../../src/modules/mission/constants';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex(MISSION).insert([
    {
      id: 1,
      content: 'Push your friend in the stairs',
    },
    {
      id: 2,
      content: 'Marry your best friend',
    },
  ]);

  await knex(PLAYER_MISSION).insert([
    {
      playerId: 1,
      missionId: 1,
    },
    {
      playerId: 2,
      missionId: 2,
    },
  ]);
}
