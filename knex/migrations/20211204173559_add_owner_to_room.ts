import { Knex } from 'knex';
import { ROOM } from '../../src/modules/room/constants';
import { PLAYER } from '../../src/modules/player/constants';

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
