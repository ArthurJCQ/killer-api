import { Knex } from 'knex';

const tableName = 'room';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id');
    table.string('name');
    table.string('code').unique();
    table.integer('nbPlayer');
    table.datetime('createdAt').notNullable();
    table
      .datetime('duration')
      .notNullable()
      .defaultTo(knex.raw(`? + INTERVAL '? day'`, [knex.fn.now(), 30]));
    table.enum('status', ['PENDING', 'IN_GAME']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
