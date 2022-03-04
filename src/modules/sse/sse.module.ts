import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SseMercureListener } from './listeners/sse-mercure.listener';

@Module({
  imports: [HttpModule],
  providers: [SseMercureListener],
})
export class SseModule {}
