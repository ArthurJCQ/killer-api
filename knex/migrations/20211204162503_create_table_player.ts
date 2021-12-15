import { Knex } from 'knex';
import { PLAYER_TABLE } from '../constants';
import { PlayerStatus } from '../../src/modules/player/model/player.model';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PLAYER_TABLE, (table) => {
    table.increments('id');
    table.string('name');
    table.integer('passcode');
    table
      .enum('status', [PlayerStatus.ALIVE, PlayerStatus.KILLED])
      .defaultTo(PlayerStatus.ALIVE);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PLAYER_TABLE);
}
