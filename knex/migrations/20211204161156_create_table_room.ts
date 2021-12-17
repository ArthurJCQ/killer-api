import { Knex } from 'knex';
import { ROOM_TABLE } from '../constants';
import { RoomStatus } from '../../src/modules/room/model/room.model';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ROOM_TABLE, (table) => {
    table.increments('id');
    table.string('name');
    table.string('code').unique();
    table.integer('nbPlayer');
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
  return knex.schema.dropTableIfExists(ROOM_TABLE);
}
