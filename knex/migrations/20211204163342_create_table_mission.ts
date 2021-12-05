import { Knex } from 'knex';
import { MISSION_TABLE } from '../constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(MISSION_TABLE, (table) => {
    table.increments('id');
    table.string('content');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(MISSION_TABLE);
}
