import { Knex } from 'knex';

import { MISSION } from '../../src/modules/mission/constants';
import { PLAYER } from '../../src/modules/player/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(PLAYER, (table) => {
    table.integer('targetId').unsigned();
    table.integer('missionId').unsigned();
    table.foreign('targetId').references('id').inTable(PLAYER);
    table.foreign('missionId').references('id').inTable(MISSION);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(PLAYER, (table) => {
    table.dropColumns('targetId', 'missionId');
  });
}
