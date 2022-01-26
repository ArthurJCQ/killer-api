import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { MissionController } from './mission.controller';
import { MissionRepository } from './mission.repository';
import { MissionService } from './mission.service';

@Module({
  imports: [DatabaseModule],
  providers: [MissionService, MissionRepository],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
