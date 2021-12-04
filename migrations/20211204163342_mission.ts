import { Knex } from 'knex';

const tableName = 'mission';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id');
    table.string('content');
    table.integer('authorId').unsigned();
    table.foreign('authorId').references('id').inTable('player');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
