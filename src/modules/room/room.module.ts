import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { PlayerModule } from '../player/player.module';

import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [DatabaseModule, PlayerModule],
  providers: [RoomService, RoomRepository],
  controllers: [RoomController],
})
export class RoomModule {}
