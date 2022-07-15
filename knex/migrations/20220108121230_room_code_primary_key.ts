import { Knex } from 'knex';

import { PLAYER, ROOM } from '../../src/modules/killer/constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table(PLAYER, (table) => {
    table.dropColumn('roomId');
    table.string('roomCode');
    table.foreign('roomCode').references('code').inTable('room');
  });

  return knex.schema.table(ROOM, (table) => {
    table.dropColumn('id');
    table.primary(['code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(ROOM, (table) => {
    table.increments('id');
    table.primary(['id']);
  });

  return knex.schema.table(PLAYER, (table) => {
    table.dropColumn('roomCode');
    table.integer('roomId');
    table.foreign('roomId').references('id').inTable('room');
  });
}
