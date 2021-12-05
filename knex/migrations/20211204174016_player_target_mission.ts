import { Knex } from 'knex';
import { PLAYER_TABLE } from '../constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(PLAYER_TABLE, (table) => {
    table.integer('targetId').unsigned();
    table.integer('missionId').unsigned();
    table.foreign('targetId').references('id').inTable('player');
    table.foreign('missionId').references('id').inTable('mission');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(PLAYER_TABLE, (table) => {
    table.dropColumns('target', 'mission');
  });
}
