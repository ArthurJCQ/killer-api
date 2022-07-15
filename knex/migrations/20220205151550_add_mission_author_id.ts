import { Knex } from 'knex';

import { MISSION_ROOM, PLAYER } from '../../src/modules/killer/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(MISSION_ROOM, (table) => {
    table.integer('authorId').unsigned();
    table.foreign('authorId').references('id').inTable(PLAYER);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(MISSION_ROOM, (table) => {
    table.dropColumn('authorId');
  });
}
