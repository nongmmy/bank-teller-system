import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TransferDto {
  @IsString()
  fromAccountId: string;

  @IsString()
  toAccountId: string;

  @IsPositive()
  @IsNumber()
  amount: number;
}
