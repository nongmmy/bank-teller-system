import { Account } from "../../../domain/models/account";
import { AccountRepositoryInterface } from "../../../domain/repositories/accountRepository.interface";
import { DepositUsecase } from "../deposit.usecase";
import { WithdrawUsecase } from "../withdraw.usecase";

describe('WithdrawUseCase', () => {
  let withdrawUsecase: WithdrawUsecase;
  let mockAccountRepository: jest.Mocked<AccountRepositoryInterface>;

  beforeEach(() => {
    // Create a mock of the AccountRepository interface
    mockAccountRepository = {
      findOne: jest.fn(),
      updateAccount: jest.fn(),
    };

    withdrawUsecase = new WithdrawUsecase(mockAccountRepository);
  });

  it('should withdraw successfully and the balance should remain', async () => {
    const accountId = 'acc-123';
    const amount = 100;

    const mockAccount = {
      accountId,
      balance: 200
    } as Account;
    mockAccountRepository.findOne.mockResolvedValue(mockAccount);

    const result = await withdrawUsecase.execute(accountId, amount);

    expect(result.balance).toBe(100);
  });

  it('should withdraw successfully and the balance is zero', async () => {
    const accountId = 'acc-123';
    const amount = 100;

    const mockAccount = {
      accountId,
      balance: 100
    } as Account;
    mockAccountRepository.findOne.mockResolvedValue(mockAccount);

    const result = await withdrawUsecase.execute(accountId, amount);

    expect(result.balance).toBe(0);
  });


  it('should throw an error if the account does not exist', async () => {
    const accountId = 'no-acc';

    mockAccountRepository.findOne.mockResolvedValue(null);

    await expect(withdrawUsecase.execute(accountId, 100)).rejects.toThrow(
      `Account with ID ${accountId} does not exist.`
    );
  });

  it('should throw an error if the balance is insufficient', async () => {
    const accountId = 'acc-123';
    const amount = 300;

    const mockAccount = {
      accountId,
      balance: 200
    } as Account;
    mockAccountRepository.findOne.mockResolvedValueOnce(mockAccount);

    await expect(withdrawUsecase.execute(accountId, amount)).rejects.toThrow(
      `Cannot withdraw ${amount}, Balance is ${mockAccount.balance}.`
    );
  });
});