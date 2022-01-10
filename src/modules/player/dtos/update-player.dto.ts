import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdatePlayerDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumberString()
  @Length(4)
  @IsOptional()
  passcode?: string;
}
