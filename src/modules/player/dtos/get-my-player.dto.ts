import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class GetMyPlayerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(1000)
  passcode: number;

  @IsNumber()
  @Min(1)
  roomId: number;
}
