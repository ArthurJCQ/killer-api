import { Knex } from 'knex';
import { PLAYER, ROOM } from '../constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(ROOM, (table) => {
    table.integer('ownerId').unsigned();
    table.foreign('ownerId').references('id').inTable(PLAYER);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(ROOM, (table) => {
    table.dropColumn('ownerId');
  });
}
