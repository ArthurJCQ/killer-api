import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [DatabaseModule],
  providers: [RoomService, RoomRepository],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
