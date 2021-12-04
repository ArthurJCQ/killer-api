import { Knex } from 'knex';

const tableName = 'player';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(tableName, (table) => {
    table.integer('target').unsigned();
    table.integer('mission').unsigned();
    table.foreign('target').references('id').inTable('player');
    table.foreign('mission').references('id').inTable('mission');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(tableName, (table) => {
    table.dropColumns('target', 'mission');
  });
}
