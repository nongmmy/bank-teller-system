import { IsString } from 'class-validator';

export class CraeteAccountDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  telephone: string;
}
