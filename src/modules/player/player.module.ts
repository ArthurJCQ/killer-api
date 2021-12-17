import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PlayerService, PlayerRepository],
  controllers: [PlayerController],
})
export class PlayerModule {}
