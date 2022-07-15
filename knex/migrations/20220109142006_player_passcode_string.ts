import { Knex } from 'knex';

import { PLAYER } from '../../src/modules/killer/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(PLAYER, (table) => {
    table.string('passcode', 4).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(PLAYER, (table) => {
    table.integer('passcode').alter();
  });
}
