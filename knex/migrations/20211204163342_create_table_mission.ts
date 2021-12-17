import { Knex } from 'knex';
import { MISSION } from '../../src/modules/mission/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(MISSION, (table) => {
    table.increments('id');
    table.string('content');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(MISSION);
}
