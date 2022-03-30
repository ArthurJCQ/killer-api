import { Transform } from 'class-transformer';

export function Capitalize(): PropertyDecorator {
  return Transform(({ value }) => value && value.toUpperCase());
}
