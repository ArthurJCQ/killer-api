import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { lastValueFrom, map } from 'rxjs';

import { MercureEvent } from '../models/mercure-event';
import { MercureEventType } from '../models/mercure-event-types';

@Injectable()
export class SseMercureListener {
  private readonly logger = new Logger();

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @OnEvent('push.mercure')
  async publishEventToMercure(event: MercureEvent): Promise<void> {
    if (event.type === MercureEventType.NO_EVENT) {
      this.logger.log(`No event was sent on topic ${event.topic}`);

      return;
    }

    this.logger.log('Sending event to Mercure...');

    const { host: mercureHost, publisherToken } =
      this.configService.get('mercure');

    this.logger.log(
      `Trying to send topic ${event.topic} with event type : ${event.type} to mercure host ${mercureHost}`,
    );

    try {
      await lastValueFrom(
        this.httpService
          .post(mercureHost, `topic=${event.topic}&data=${event.data}`, {
            headers: {
              Authorization: `Bearer ${publisherToken}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(
            map((resp) => {
              this.logger.log(
                `Event successfully sent to Mercure : ${resp.data}`,
              );
            }),
          ),
      );
    } catch (e) {
      this.logger.warn(`Event could not be sent to Mercure : ${e}`);
    }

    return;
  }
}
