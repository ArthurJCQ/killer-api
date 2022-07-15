import { Knex } from 'knex';

import { MISSION_ROOM } from '../../src/modules/killer/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(MISSION_ROOM, (table) => {
    table.increments('id');
    table.string('roomCode').unsigned();
    table.integer('missionId').unsigned();
    table.foreign('roomCode').references('code').inTable('room');
    table.foreign('missionId').references('id').inTable('mission');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(MISSION_ROOM);
}
