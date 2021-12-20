import { Knex } from 'knex';

import { ROOM, RoomStatus } from '../../src/modules/room/constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ROOM, (table) => {
    table.increments('id');
    table.string('name').defaultTo('');
    table.string('code').unique();
    table.integer('nbPlayer').defaultTo(0);
    table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
    table
      .datetime('dateEnd')
      .notNullable()
      .defaultTo(knex.raw(`? + INTERVAL '? day'`, [knex.fn.now(), 30]));
    table
      .enum('status', [
        RoomStatus.PENDING,
        RoomStatus.IN_GAME,
        RoomStatus.ENDED,
      ])
      .defaultTo(RoomStatus.PENDING);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ROOM);
}
