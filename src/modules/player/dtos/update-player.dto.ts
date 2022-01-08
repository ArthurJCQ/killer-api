import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  passcode: number;
}
