import { Knex } from 'knex';

const tableName = 'room';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table(tableName, (table) => {
    table.integer('owner').unsigned();
    table.foreign('owner').references('id').inTable('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table(tableName, (table) => {
    table.dropColumn('owner');
  });
}
