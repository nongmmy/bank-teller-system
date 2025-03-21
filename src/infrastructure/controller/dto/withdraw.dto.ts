import { IsNumber, IsPositive, IsString } from 'class-validator';

export class WithdrawDto {
  @IsString()
  accountId: string;

  @IsPositive()
  @IsNumber()
  amount: number;
}
