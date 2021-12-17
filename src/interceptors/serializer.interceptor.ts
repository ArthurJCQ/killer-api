import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export function Serialize(dto: Class) {
  return UseInterceptors(new SerializerInterceptor(dto));
}

class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: Class) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) =>
        plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
