import { Knex } from 'knex';
import { ROOM_TABLE } from '../constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(ROOM_TABLE, (table) => {
    table.integer('ownerId').unsigned();
    table.foreign('ownerId').references('id').inTable('player');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(ROOM_TABLE, (table) => {
    table.dropColumn('owner');
  });
}
