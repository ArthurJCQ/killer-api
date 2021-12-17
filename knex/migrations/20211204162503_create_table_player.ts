import { Knex } from 'knex';
import {
  PlayerRole,
  PlayerStatus,
} from '../../src/modules/player/model/player.model';
import { PLAYER } from '../constants';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PLAYER, (table) => {
    table.increments('id');
    table.string('name');
    table.integer('passcode');
    table
      .enum('status', [PlayerStatus.ALIVE, PlayerStatus.KILLED])
      .defaultTo(PlayerStatus.ALIVE);
    table
      .enum('role', [PlayerRole.PLAYER, PlayerRole.ADMIN])
      .defaultTo(PlayerRole.PLAYER);
    table.integer('roomId').unsigned();
    table.foreign('roomId').references('id').inTable('room');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PLAYER);
}
