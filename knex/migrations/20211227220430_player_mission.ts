import { Knex } from 'knex';

import { PLAYER_MISSION } from '../../src/modules/mission/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PLAYER_MISSION, (table) => {
    table.increments('id');
    table.integer('playerId').unsigned();
    table.integer('missionId').unsigned();
    table.foreign('playerId').references('id').inTable('player');
    table.foreign('missionId').references('id').inTable('mission');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PLAYER_MISSION);
}
