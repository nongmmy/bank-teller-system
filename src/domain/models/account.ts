import { Customer } from './customer';

export type Account = {
  accountId: string;
  balance: number;
  customer: Customer;
};
