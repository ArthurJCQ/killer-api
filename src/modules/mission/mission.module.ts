import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';

@Module({
  providers: [MissionService],
})
export class MissionModule {}
